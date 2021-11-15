import React from "react"
import { Track } from "../../models"
import { Switch, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { scale } from "../../theme/scale"
import { DownloadState } from "../../clients/TrackDownloadsClient"
import { useDownload } from "../../hooks/useDownload"

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

function getSwitchAccessibilityLabelState(status: DownloadState["type"]): string {
  switch (status) {
    case "UNKNOWN":
      return "unbekannter Herunterladzustand"
    case "NOT_DOWNLOADED":
      return "nicht heruntergeladen"
    case "DOWNLOADING":
      return "beim Herunterladen"
    case "DOWNLOADED":
      return "heruntergeladen"
    case "FAILED_DOWNLOADING":
      return "Fehler beim Herunterladen"
    case "DOWNLOAD_PAUSED":
      return "pausiert"
  }
}

function getSwitchAccessibilityHintAction(status: DownloadState["type"]): string {
  switch (status) {
    case "UNKNOWN":
      return ""
    case "FAILED_DOWNLOADING":
    case "NOT_DOWNLOADED":
      return "herunterladen"
    case "DOWNLOADING":
      return "abbrechen"
    case "DOWNLOAD_PAUSED":
      return "fortsetzen"
    case "DOWNLOADED":
      return "löschen"
  }
}

export interface DownloadSwitchProps {
  tracks: Track[]
}

export function DownloadSwitch({ tracks }: DownloadSwitchProps) {
  const { state: downloadState, start, pause, clear } = useDownload(tracks[0])

  const onSwitchValueChange = () => {
    if (downloadState.type === "NOT_DOWNLOADED" || downloadState.type === "DOWNLOAD_PAUSED") {
      start()
    } else if (downloadState.type === "DOWNLOADING") {
      pause()
    } else if (downloadState.type === "DOWNLOADED") {
      clear()
    }
  }

  return (
    <View style={ROOT}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${getSwitchAccessibilityLabelState(downloadState.type)}`}
        accessibilityHint={`Aktion: ${getSwitchAccessibilityHintAction(downloadState.type)}`}
        accessibilityRole="switch"
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={
          downloadState.type === "DOWNLOADING" || downloadState.type === "DOWNLOADED"
            ? "#f5dd4b"
            : "#f4f3f4"
        }
        ios_backgroundColor="#3e3e3e"
        disabled={downloadState.type === "UNKNOWN"}
        value={downloadState.type === "DOWNLOADING" || downloadState.type === "DOWNLOADED"}
        onValueChange={onSwitchValueChange}
      />
      {downloadState.type === "DOWNLOADING" && (
        <Text
          accessible={true}
          accessibilityLabel={`${Math.round(downloadState.progress * 100)}%`}
          accessibilityHint="prozentualer Herunterladefortschritt"
          accessibilityRole="text"
          style={PERCENTAGE}
        >
          {Math.round(downloadState.progress * 100)}%
        </Text>
      )}
      <Text>{downloadState.type}</Text>
    </View>
  )
}
