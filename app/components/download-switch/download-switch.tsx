import React, { useEffect, useState } from "react"
import { DownloadResumable, FileSystemDownloadResult } from "expo-file-system"
import { DownloadSwitchProps } from "./download-switch.props"
import { FileSystem } from "react-native-unimodules"
import { Switch, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { scale } from "../../theme/scale"
import { Track } from "../../models"
import { getTrackFileUri } from "../../utils/file"

const ROOT: ViewStyle = {
  marginVertical: spacing.medium,
  marginHorizontal: spacing.medium,
  flexDirection: "row",
  justifyContent: "center",
}
const PERCENTAGE: TextStyle = {
  color: color.text,
  fontSize: scale.tiny,
}

enum DownloadStatus {
  Unknown = "UNKNOWN",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloading = "DOWNLOADING",
  Paused = "PAUSED",
  Downloaded = "DOWNLOADED",
}

enum DownloadStatusToBe {
  Unknown = "UNKNOWN",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloaded = "DOWNLOADED",
}

enum DownloadSwitchStatus {
  Unknown = "UNKNOWN",
  Deleting = "DELETING",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloading = "DOWNLOADING",
  Downloaded = "DOWNLOADED",
}

function any(
  statuses: Map<string, DownloadStatus>,
  predicate: (status: DownloadStatus) => boolean,
) {
  for (const status of statuses.values()) {
    if (predicate(status)) {
      return true
    }
  }
  return false
}

function all(
  statuses: Map<string, DownloadStatus>,
  predicate: (status: DownloadStatus) => boolean,
) {
  for (const status of statuses.values()) {
    if (!predicate(status)) {
      return false
    }
  }
  return true
}

function getSwitchStatus(status: DownloadSwitchStatus, statuses: Map<string, DownloadStatus>) {
  switch (status) {
    case DownloadSwitchStatus.Unknown:
      if (any(statuses, (status) => status === DownloadStatus.Unknown)) {
        return DownloadSwitchStatus.Unknown
      }
      if (all(statuses, (status) => status === DownloadStatus.Downloaded)) {
        return DownloadSwitchStatus.Downloaded
      }
      if (any(statuses, (status) => status === DownloadStatus.NotDownloaded)) {
        return DownloadSwitchStatus.NotDownloaded
      }
      console.error(`Impossible state!`, status, statuses)
      break
    case DownloadSwitchStatus.Deleting:
      if (
        all(
          statuses,
          (status) => status === DownloadStatus.NotDownloaded || status === DownloadStatus.Paused,
        )
      ) {
        return DownloadSwitchStatus.NotDownloaded
      }
      break
    case DownloadSwitchStatus.Downloading:
      if (all(statuses, (status) => status === DownloadStatus.Downloaded)) {
        return DownloadSwitchStatus.Downloaded
      }
      break
  }
  return status
}

function computeProgressPercentage(progressPercentages: Map<string, number>) {
  let sum = 0
  for (const value of progressPercentages.values()) {
    sum += value
  }
  return sum / progressPercentages.size
}

function getDownloadStatusToBe(status: DownloadSwitchStatus) {
  switch (status) {
    case DownloadSwitchStatus.Unknown:
      return DownloadStatusToBe.Unknown
    case DownloadSwitchStatus.Deleting:
    case DownloadSwitchStatus.NotDownloaded:
      return DownloadStatusToBe.NotDownloaded
    case DownloadSwitchStatus.Downloading:
    case DownloadSwitchStatus.Downloaded:
      return DownloadStatusToBe.Downloaded
  }
}

function getTemporaryFileUri(track: Track) {
  return `${FileSystem.cacheDirectory}${track.trackId}.${track.fileExtension}`
}

type AbortSignal = {
  aborted: boolean
}

export function DownloadSwitch({
  tracks,
  onDownloadComplete,
  onDownloadJustAboutToBeDeleted,
}: DownloadSwitchProps) {
  // TODO Abort long-running asynchronous tasks, aka, promises, more safely.
  // Maybe with SWR as said on
  // https://github.com/vercel/swr#conditional-fetching
  const [abortSignal, setAbortSignal] = useState<AbortSignal>(() => {
    return {
      aborted: false,
    }
  })
  const [switchStatus, setSwitchStatus] = useState(DownloadSwitchStatus.Unknown)
  const [progressPercentage, setProgressPercentage] = useState(0)
  // TODO We currently update these maps' values directly without changing the
  // map, that is, we do not use the setters returned by `useState`. Doing
  // otherwise required me to seemingly unnecessarily copy that map before each
  // update. There probably is some benefit to doing this though. What are the
  // advantages and disadvantages?
  const [statuses] = useState<Map<string, DownloadStatus>>(
    () => new Map(tracks.map((track) => [track.trackId, DownloadStatus.Unknown])),
  )
  const [progressPercentages] = useState<Map<string, number>>(
    () => new Map(tracks.map((track) => [track.trackId, 0])),
  )
  const [resumableDownloads] = useState<Map<string, DownloadResumable | null>>(
    () => new Map(tracks.map((track) => [track.trackId, null])),
  )

  const updateTrackProgressPercentage = (track: Track, percentage: number) => {
    if (progressPercentages.get(track.trackId) !== percentage) {
      progressPercentages.set(track.trackId, percentage)
      setProgressPercentage(computeProgressPercentage(progressPercentages))
    }
  }

  const handleDownload = async (
    track: Track,
    download: () => Promise<FileSystemDownloadResult>,
  ) => {
    // TODO Check `newAbortSignal.aborted` after every `await`?
    statuses.set(track.trackId, DownloadStatus.Downloading)
    const { uri, md5, status: statusCode } = await download()
    if (statusCode !== 200) {
      console.warn(
        `Downloading track ${track.trackId} responded with HTTP status code ${statusCode}, expected 200.`,
      )
    }
    if (md5 !== track.md5FileHashValue) {
      // TODO Delete downloaded file?
      console.error(
        `Downloaded track ${track.trackId} has wrong md5 hash value ${md5}, expected ${track.md5FileHashValue}.`,
      )
    }
    __DEV__ && console.log(`Downloaded track ${track.trackId}.`)
    await FileSystem.moveAsync({ from: uri, to: getTrackFileUri(track) })
    statuses.set(track.trackId, DownloadStatus.Downloaded)
    const resumableDownload = resumableDownloads.get(track.trackId)
    if (resumableDownload !== null) {
      resumableDownload._callback = undefined
      resumableDownload._removeSubscription()
      resumableDownloads.set(track.trackId, null)
    }
    await onDownloadComplete(track.trackId, getTrackFileUri(track))
  }

  const updateStatus = async (newStatus: DownloadSwitchStatus, newAbortSignal: AbortSignal) => {
    __DEV__ && console.log(`Updating status from ${switchStatus} to ${newStatus}`)
    setSwitchStatus(newStatus)
    const downloadStatusToBe = getDownloadStatusToBe(newStatus)
    await Promise.all(
      tracks.map(async (track) => {
        try {
          if (newAbortSignal.aborted) {
            console.log(`Aborting updating status for ${track.trackId} to ${newStatus}.`)
          } else {
            switch (statuses.get(track.trackId)) {
              case DownloadStatus.Unknown: {
                console.error(`Download status of track ${track.trackId} is unknown.`)
                break
              }
              case DownloadStatus.Downloaded: {
                if (downloadStatusToBe === DownloadStatusToBe.NotDownloaded) {
                  __DEV__ && console.log(`Deleting track ${track.trackId}`)
                  await onDownloadJustAboutToBeDeleted(track.trackId, track.webUri)
                  // TODO Check `newAbortSignal.aborted` after every `await`?
                  await FileSystem.deleteAsync(getTrackFileUri(track))
                  updateTrackProgressPercentage(track, 0)
                  statuses.set(track.trackId, DownloadStatus.NotDownloaded)
                }
                break
              }
              case DownloadStatus.Downloading: {
                if (downloadStatusToBe === DownloadStatusToBe.NotDownloaded) {
                  __DEV__ && console.log(`Pausing download of track ${track.trackId}`)
                  await resumableDownloads.get(track.trackId).pauseAsync()
                  statuses.set(track.trackId, DownloadStatus.Paused)
                }
                break
              }
              case DownloadStatus.Paused: {
                if (downloadStatusToBe === DownloadStatusToBe.Downloaded) {
                  __DEV__ && console.log(`Resuming download of track ${track.trackId}`)
                  await handleDownload(track, () =>
                    resumableDownloads.get(track.trackId).resumeAsync(),
                  )
                }
                break
              }
              case DownloadStatus.NotDownloaded: {
                if (downloadStatusToBe === DownloadStatusToBe.Downloaded) {
                  __DEV__ && console.log(`Downloading track ${track.trackId}`)
                  await handleDownload(track, () => {
                    // TODO Is it possible that there already is a resumable
                    // download instance for this track (maybe some race
                    // condition)? In this case it needs to be cleaned up
                    // properly or reused!
                    const newResumableDownload = FileSystem.createDownloadResumable(
                      track.webUri,
                      getTemporaryFileUri(track),
                      { md5: true },
                      ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
                        updateTrackProgressPercentage(
                          track,
                          totalBytesWritten / totalBytesExpectedToWrite,
                        )
                      },
                    )
                    resumableDownloads.set(track.trackId, newResumableDownload)
                    return newResumableDownload.downloadAsync()
                  })
                }
                break
              }
            }
          }
        } catch (error) {
          console.error(`Switching download status of track ${track.trackId} failed.`, error)
        }
      }),
    )
    const evenNewerState = getSwitchStatus(newStatus, statuses)
    if (newAbortSignal.aborted) {
      __DEV__ && console.log(`Aborting updating status from ${newStatus} to ${evenNewerState}.`)
    } else {
      __DEV__ && console.log(`Updating status again now from ${newStatus} to ${evenNewerState}`)
      setSwitchStatus(evenNewerState)
    }
  }

  useEffect(() => {
    // TODO Use some better approach to avoid updating state of unmounted
    // component. The current approach is inspired by
    // https://juliangaramendy.dev/blog/use-promise-subscription
    // They adivce the usage of SWR instead as detailed in
    // https://juliangaramendy.dev/blog/managing-remote-data-with-swr
    // According to its documentation SWR supports react native; do a full-text
    // search on https://github.com/vercel/swr
    // SWR may also be used to abort promises as detailed on
    // https://github.com/vercel/swr#conditional-fetching
    let isMounted = true
    // For why this function lives inside `useEffect` read
    // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
    const determineDownloadStatuses = async () => {
      await Promise.all(
        tracks.map(async (track) => {
          try {
            const { exists } = await FileSystem.getInfoAsync(getTrackFileUri(track))
            if (isMounted) {
              statuses.set(
                track.trackId,
                exists ? DownloadStatus.Downloaded : DownloadStatus.NotDownloaded,
              )
            }
          } catch (error) {
            console.error(`Failed to determine download status of track ${track.trackId}.`, error)
          }
        }),
      )
      if (isMounted) {
        setSwitchStatus(getSwitchStatus(switchStatus, statuses))
      }
    }
    __DEV__ && console.log("Determining download status.", tracks, switchStatus, statuses)
    determineDownloadStatuses()
    return () => (isMounted = false)
  }, []) // tracks, switchStatus, statuses // TODO List dependencies in a proper way. Get inspired by https://github.com/facebook/react/issues/14476#issuecomment-471199055

  useEffect(() => {
    return () => {
      __DEV__ && console.log("Removing callbacks and subscriptions.", resumableDownloads)
      for (const resumableDownload of resumableDownloads.values()) {
        if (resumableDownload !== null) {
          resumableDownload._callback = undefined
          resumableDownload._removeSubscription()
        }
      }
    }
  }, []) // resumableDownloads // TODO List dependencies in a proper way. Get inspired by https://github.com/facebook/react/issues/14476#issuecomment-471199055

  useEffect(() => {
    return () => {
      __DEV__ && console.log("Deleting temporary files.", tracks)
      Promise.all(
        tracks.map(async (track) => {
          try {
            await FileSystem.deleteAsync(getTemporaryFileUri(track), { idempotent: true })
          } catch (error) {
            console.error(`Failed to delete temporary file of track ${track.trackId}`)
          }
        }),
      )
    }
  }, []) // tracks // TODO List dependencies in a proper way. Get inspired by https://github.com/facebook/react/issues/14476#issuecomment-471199055

  const doSwitchStatus = () => {
    abortSignal.aborted = true
    const newAbortSignal = { aborted: false }
    setAbortSignal(newAbortSignal)
    switch (switchStatus) {
      case DownloadSwitchStatus.Unknown:
        console.error(`Switched status in unknown status --- impossible!`)
        return Promise.resolve
      case DownloadSwitchStatus.Deleting:
      case DownloadSwitchStatus.NotDownloaded:
        return updateStatus(DownloadSwitchStatus.Downloading, newAbortSignal)
      case DownloadSwitchStatus.Downloading:
      case DownloadSwitchStatus.Downloaded:
        return updateStatus(DownloadSwitchStatus.Deleting, newAbortSignal)
    }
  }

  const getSwitchAccessibilityLabelState = () => {
    switch (switchStatus) {
      case DownloadSwitchStatus.Unknown:
        return "unbekannter Herunterladzustand"
      case DownloadSwitchStatus.Deleting:
        return "beim Löschen"
      case DownloadSwitchStatus.NotDownloaded:
        return "nicht heruntergeladen"
      case DownloadSwitchStatus.Downloading:
        return "beim Herunterladen"
      case DownloadSwitchStatus.Downloaded:
        return "heruntergeladen"
    }
  }

  const getSwitchAccessibilityHintAction = () => {
    switch (switchStatus) {
      case DownloadSwitchStatus.Unknown:
        return ""
      case DownloadSwitchStatus.Deleting:
      case DownloadSwitchStatus.NotDownloaded:
        return "herunterladen"
      case DownloadSwitchStatus.Downloading:
        return "abbrechen"
      case DownloadSwitchStatus.Downloaded:
        return "löschen"
    }
  }

  return (
    <View style={ROOT}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${getSwitchAccessibilityLabelState()}`}
        accessibilityHint={`Aktion: ${getSwitchAccessibilityHintAction()}`}
        accessibilityRole="switch"
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={
          switchStatus === DownloadSwitchStatus.Downloading ||
          switchStatus === DownloadSwitchStatus.Downloaded
            ? "#f5dd4b"
            : "#f4f3f4"
        }
        ios_backgroundColor="#3e3e3e"
        disabled={switchStatus === DownloadSwitchStatus.Unknown}
        value={
          switchStatus === DownloadSwitchStatus.Downloading ||
          switchStatus === DownloadSwitchStatus.Downloaded
        }
        onValueChange={doSwitchStatus}
      />
      {switchStatus === DownloadSwitchStatus.Downloading && (
        <Text
          accessible={true}
          accessibilityLabel={`${Math.round(progressPercentage * 100)}%`}
          accessibilityHint="prozentualer Herunterladefortschritt"
          accessibilityRole="text"
          style={PERCENTAGE}
        >
          {Math.round(progressPercentage * 100)}%
        </Text>
      )}
    </View>
  )
}
