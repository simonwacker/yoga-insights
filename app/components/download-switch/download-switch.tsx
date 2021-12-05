import React from "react"
import { Track } from "../../models"
import { View, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { spacing } from "../../theme"
import { DownloadState } from "../../clients/TrackDownloadsClient"
import { TransitionAction, useDownload } from "../../hooks/useDownload"
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

function getSwitchAccessibilityHintAction(action: TransitionAction): string {
  switch (action) {
    case TransitionAction.Start:
      return "herunterladen"
    case TransitionAction.Cancel:
      return "abbrechen"
    case TransitionAction.Delete:
      return "löschen"
  }
}

export interface DownloadSwitchProps {
  track: Track
}

export function DownloadSwitch({ track }: DownloadSwitchProps) {
  const { state: downloadState, transition } = useDownload(track)

  const startable =
    downloadState.type === "NOT_DOWNLOADED" || downloadState.type === "FAILED_DOWNLOADING"

  const onSwitchValueChange = () => {
    if (transition === null) {
      __DEV__ && console.error("Magic! How did you do that? You managed to turn a disabled switch!")
    } else {
      transition.transit()
    }
  }

  return (
    <View style={ROOT}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${getSwitchAccessibilityLabelState(downloadState.type)}`}
        accessibilityHint={
          transition === null
            ? undefined
            : `Aktion: ${getSwitchAccessibilityHintAction(transition.action)}`
        }
        accessibilityRole="switch"
        disabled={transition === null}
        value={!startable}
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
