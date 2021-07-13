import React, { useEffect, useState } from "react"
import { DownloadResumable, FileSystemDownloadResult } from "expo-file-system"
import { DownloadSwitchProps } from "./download-switch.props"
import { FileSystem } from "react-native-unimodules"
import { Switch, View } from "react-native"
import { Text } from "../../components"

enum DownloadStatus {
  Unknown = "UNKNOWN",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloading = "DOWNLOADING",
  Paused = "PAUSED",
  Downloaded = "DOWNLOADED",
}

export function DownloadSwitch({
  trackId,
  sourceWebUri,
  targetFileUri,
  md5FileHashValue,
  onDownloadComplete,
  onDownloadJustAboutToBeDeleted,
}: DownloadSwitchProps) {
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState(DownloadStatus.Unknown)
  const [resumableDownload, setResumableDownload] = useState<DownloadResumable | undefined>()
  const temporaryFileUri = FileSystem.cacheDirectory + trackId

  const onResumableDownloadProgressUpdate = ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
    setDownloadProgress(totalBytesWritten / totalBytesExpectedToWrite)
  }

  useEffect(() => {
    determineDownloadStatus()
  }, [])

  useEffect(() => {
    return resumableDownload
      ? () => {
          resumableDownload._removeSubscription()
        }
      : undefined
  }, [resumableDownload])

  useEffect(() => {
    return () => FileSystem.deleteAsync(temporaryFileUri, { idempotent: true })
  }, [])

  const determineDownloadStatus = async () => {
    try {
      const { exists } = await FileSystem.getInfoAsync(targetFileUri)
      setDownloadStatus(exists ? DownloadStatus.Downloaded : DownloadStatus.NotDownloaded)
    } catch (error) {
      console.log("Failed to determine download status.", error)
    }
  }

  const switchDownloadStatus = async () => {
    try {
      switch (downloadStatus) {
        case DownloadStatus.Unknown: {
          console.error(
            `Switched download status of track ${trackId} in unknown state --- impossible!`,
          )
          break
        }
        case DownloadStatus.Downloaded: {
          await onDownloadJustAboutToBeDeleted(sourceWebUri)
          await FileSystem.deleteAsync(targetFileUri)
          setDownloadProgress(0)
          setDownloadStatus(DownloadStatus.NotDownloaded)
          break
        }
        case DownloadStatus.Downloading: {
          await resumableDownload.pauseAsync()
          setDownloadStatus(DownloadStatus.Paused)
          break
        }
        case DownloadStatus.Paused: {
          await handleDownload(() => resumableDownload.resumeAsync())
          break
        }
        case DownloadStatus.NotDownloaded: {
          await handleDownload(() => {
            const newResumableDownload = FileSystem.createDownloadResumable(
              sourceWebUri,
              temporaryFileUri,
              { md5: true },
              onResumableDownloadProgressUpdate,
            )
            setResumableDownload(newResumableDownload)
            return newResumableDownload.downloadAsync()
          })
          break
        }
      }
    } catch (error) {
      console.error("Switching download status of audio failed.", error)
    }
  }

  const handleDownload = async (download: () => Promise<FileSystemDownloadResult>) => {
    setDownloadStatus(DownloadStatus.Downloading)
    const { uri, md5, status } = await download()
    if (status !== 200) {
      console.warn(`Downloading track ${trackId} responded with HTTP status code ${status}.`)
    }
    if (md5 !== md5FileHashValue) {
      // TODO Delete downloaded file?
      console.error(
        `Downloaded track ${trackId} has wrong md5 hash value ${md5}, expected ${md5FileHashValue}`,
      )
    }
    await FileSystem.moveAsync({ from: uri, to: targetFileUri })
    setDownloadStatus(DownloadStatus.Downloaded)
    setResumableDownload(undefined)
    await onDownloadComplete(targetFileUri)
  }

  const getSwitchAccessibilityLabelState = () => {
    switch (downloadStatus) {
      case DownloadStatus.Unknown:
        return "unbekannter Herunterladzustand"
      case DownloadStatus.NotDownloaded:
      case DownloadStatus.Paused:
        return "nicht heruntergeladen"
      case DownloadStatus.Downloading:
        return "beim Herunterladen"
      case DownloadStatus.Downloaded:
        return "heruntergeladen"
    }
  }

  const getSwitchAccessibilityHintAction = () => {
    switch (downloadStatus) {
      case DownloadStatus.Unknown:
        return ""
      case DownloadStatus.NotDownloaded:
      case DownloadStatus.Paused:
        return "herunterladen"
      case DownloadStatus.Downloading:
        return "abbrechen"
      case DownloadStatus.Downloaded:
        return "löschen"
    }
  }

  return (
    <View style={{ marginVertical: 15, marginHorizontal: 15, flexDirection: "row" }}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${getSwitchAccessibilityLabelState()}`}
        accessibilityHint={`Aktion: ${getSwitchAccessibilityHintAction()}`}
        accessibilityRole="switch"
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={
          downloadStatus === DownloadStatus.Downloading ||
          downloadStatus === DownloadStatus.Downloaded
            ? "#f5dd4b"
            : "#f4f3f4"
        }
        ios_backgroundColor="#3e3e3e"
        disabled={downloadStatus === DownloadStatus.Unknown}
        value={
          downloadStatus === DownloadStatus.Downloading ||
          downloadStatus === DownloadStatus.Downloaded
        }
        onValueChange={switchDownloadStatus}
      />
      {downloadStatus === DownloadStatus.Downloading && (
        <Text
          accessible={true}
          accessibilityLabel={`${Math.round(downloadProgress * 100)}%`}
          accessibilityHint="prozentualer Herunterladefortschritt"
          accessibilityRole="text"
          style={{ color: "white", fontSize: 12 }}
        >
          {Math.round(downloadProgress * 100)}%
        </Text>
      )}
    </View>
  )
}
