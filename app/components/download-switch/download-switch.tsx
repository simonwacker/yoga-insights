import React from "react"
import { Track } from "../../models"
import { View, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { spacing } from "../../theme"
import { DownloadState } from "../../clients/TrackDownloadsClient"
import { useDownload } from "../../hooks/useDownload"
import { Switch } from "react-native-paper"

const ROOT: ViewStyle = {
  marginVertical: spacing.medium,
  marginHorizontal: spacing.medium,
  flexDirection: "row",
  justifyContent: "center",
}

function getSwitchAccessibilityLabelState(status: DownloadState["type"]): string {
  switch (status) {
    case "UNKNOWN":
      return "unbekannter Herunterladzustand"
    case "NOT_DOWNLOADED":
      return "nicht heruntergeladen"
    case "DOWNLOADING":
    case "FINALIZING":
      return "beim Herunterladen"
    case "DOWNLOADED":
      return "heruntergeladen"
    case "FAILED_DOWNLOADING":
      return "Fehler beim Herunterladen"
    case "CANCELLING":
      return "beim Abbrechen"
    case "DELETING":
      return "beim Löschen"
  }
}

function getSwitchAccessibilityHintAction(status: DownloadState["type"]): string {
  switch (status) {
    case "UNKNOWN":
    case "FINALIZING":
    case "CANCELLING":
    case "DELETING":
      return ""
    case "FAILED_DOWNLOADING":
    case "NOT_DOWNLOADED":
      return "herunterladen"
    case "DOWNLOADING":
      return "abbrechen"
    case "DOWNLOADED":
      return "löschen"
  }
}

export interface DownloadSwitchProps {
  tracks: Track[]
}

export function DownloadSwitch({ tracks }: DownloadSwitchProps) {
  const { state: downloadState, start, cancel, deletex } = useDownload(tracks[0])

  const disabled =
    downloadState.type === "UNKNOWN" ||
    downloadState.type === "FINALIZING" ||
    downloadState.type === "CANCELLING" ||
    downloadState.type === "DELETING"

  const onSwitchValueChange = () => {
    if (disabled) {
      __DEV__ && console.error("Magic! How did you do that? You managed to turn a disabled switch!")
    }
    switch (downloadState.type) {
      case "NOT_DOWNLOADED":
      case "FAILED_DOWNLOADING":
        return start()
      case "DOWNLOADING":
        return cancel()
      case "DOWNLOADED":
        return deletex()
      default:
        __DEV__ &&
          console.error(
            `Oh, shoot, we forgot about download state ${downloadState.type}. What action should be taken?`,
          )
    }
  }

  return (
    <View style={ROOT}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${getSwitchAccessibilityLabelState(downloadState.type)}`}
        accessibilityHint={`Aktion: ${getSwitchAccessibilityHintAction(downloadState.type)}`}
        accessibilityRole="switch"
        disabled={disabled}
        value={downloadState.type === "DOWNLOADING" || downloadState.type === "DOWNLOADED"}
        onValueChange={onSwitchValueChange}
      />
      {downloadState.type === "DOWNLOADING" && (
        <Text
          accessible={true}
          accessibilityLabel={`${Math.round(downloadState.progress * 100)}%`}
          accessibilityHint="prozentualer Herunterladefortschritt"
          accessibilityRole="text"
        >
          {Math.round(downloadState.progress * 100)}%
        </Text>
      )}
      <Text>{downloadState.type}</Text>
    </View>
  )
}
