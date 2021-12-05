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
  transit: () => void
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

  const currentState = trackDownloadsClient.fetchDownloadState(track.trackId)

  return {
    state: currentState,
    transition:
      currentState.type === "UNKNOWN" ||
      currentState.type === "FINALIZING" ||
      currentState.type === "CANCELLING" ||
      currentState.type === "DELETING"
        ? null
        : (() => {
            switch (currentState.type) {
              case "NOT_DOWNLOADED":
              case "FAILED_DOWNLOADING":
                return {
                  transit: () => trackDownloadsClient.startDownload(track),
                  action: TransitionAction.Start,
                }
              case "DOWNLOADING":
                return {
                  transit: () => trackDownloadsClient.cancelDownload(track),
                  action: TransitionAction.Cancel,
                }
              case "DOWNLOADED":
                return {
                  transit: () => trackDownloadsClient.deleteDownload(track),
                  action: TransitionAction.Delete,
                }
            }
          })(),
  }
}
