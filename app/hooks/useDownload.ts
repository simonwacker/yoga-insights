import { useEffect, useRef, useState } from "react"
import {
  DownloadState,
  RequestedDownloadState,
  TransitionAction,
} from "../clients/TrackDownloadsClient"
import { useTrackDownloadsClient } from "../contexts/TrackDownloadsClientContext"
import { Track } from "../models"

export type Transition = {
  perform: () => void
  action: TransitionAction
}

type UseDownloadResult = {
  state: DownloadState
  requestedState: RequestedDownloadState
  failed: boolean
  transition: Transition
}

export function useDownload(track: Track): UseDownloadResult {
  const trackDownloadsClient = useTrackDownloadsClient()
  const isMountedRef = useRef(false)
  const [, forceRerender] = useState(0)

  useEffect(() => {
    isMountedRef.current = true
    const unsubscribe = trackDownloadsClient.subscribe(track.trackId, () => {
      if (isMountedRef.current) {
        forceRerender((x) => x + 1)
      }
    })
    trackDownloadsClient.setCachedDownloadStateFromStateInLocalFileSystemIfItIsUnknown(track)

    return () => {
      isMountedRef.current = false
      unsubscribe()
    }
  }, [])

  const currentState = trackDownloadsClient.getDownloadState(track.trackId)
  const requestedState = trackDownloadsClient.getRequestedDownloadState(track.trackId)
  const [stateToRequestNext, actionToTakeNext] =
    trackDownloadsClient.getStateToRequestNextAndCorrespondingAction(track.trackId)

  return {
    state: currentState,
    requestedState: requestedState,
    failed: trackDownloadsClient.hasFailedToSatisfyRequest(track.trackId),
    transition: {
      perform: () => trackDownloadsClient.transition(track, stateToRequestNext),
      action: actionToTakeNext,
    },
  }
}
