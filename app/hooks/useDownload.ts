import { useEffect, useRef, useState } from "react"
import { DownloadState } from "../clients/TrackDownloadsClient"
import { useTrackDownloadsClient } from "../contexts/TrackDownloadsClientContext"
import { Track } from "../models"

type UseDownloadResult = {
  state: DownloadState
  start: () => void
  clear: () => void
  pause: () => void
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
    start: () => {
      trackDownloadsClient.startOrResumeDownload(track)
    },
    clear: () => {
      trackDownloadsClient.clearDownload(track)
    },
    pause: () => {
      trackDownloadsClient.pauseDownload(track.trackId)
    },
  }
}
