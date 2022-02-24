import { useEffect, useRef, useState } from "react"
import { DownloadState } from "../clients/TrackDownloadsClient"
import { useTrackDownloadsClient } from "../contexts/TrackDownloadsClientContext"
import { Track } from "../models"

export enum TransitionAction {
  Start = "START",
  Cancel = "CANCEL",
  Delete = "DELETE",
}

export type Transition = {
  perform: () => void
  action: TransitionAction
}

type UseDownloadResult = {
  state: DownloadState
  transition: Transition | null
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

  return {
    state: currentState,
    transition:
      currentState.type === "UNKNOWN"
        ? null
        : (() => {
            switch (currentState.type) {
              case "NOT_DOWNLOADED":
              case "CANCELLING":
              case "DELETING":
              case "FAILED_DOWNLOADING":
                return {
                  perform: () => trackDownloadsClient.transition(track, "DOWNLOADED"),
                  action: TransitionAction.Start,
                }
              case "DOWNLOADING":
              case "FINALIZING":
                return {
                  perform: () => trackDownloadsClient.transition(track, "NOT_DOWNLOADED"),
                  action: TransitionAction.Cancel,
                }
              case "DOWNLOADED":
                return {
                  perform: () => trackDownloadsClient.transition(track, "NOT_DOWNLOADED"),
                  action: TransitionAction.Delete,
                }
            }
          })(),
  }
}
