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
      return "beim Herunterladen"
    case "DOWNLOADED":
      return "heruntergeladen"
    case "FAILED_DOWNLOADING":
      return "Fehler beim Herunterladen"
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
    case "DOWNLOADED":
      return "löschen"
  }
}

export interface DownloadSwitchProps {
  tracks: Track[]
}

export function DownloadSwitch({ tracks }: DownloadSwitchProps) {
  const { state: downloadState, start, clear } = useDownload(tracks[0])

  const onSwitchValueChange = () => {
    if (downloadState.type === "NOT_DOWNLOADED") {
      start()
    } else if (downloadState.type === "DOWNLOADING") {
      clear()
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
        >
          {Math.round(downloadState.progress * 100)}%
        </Text>
      )}
      <Text>{downloadState.type}</Text>
    </View>
  )
}
