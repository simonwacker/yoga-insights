import React from "react"
import { Track } from "../models"
import { View, ViewStyle } from "react-native"
import { Text } from "./text/text"
import {
  AccumulatedDownloadState,
  AccumulatedTransitionAction,
  useDownloads,
} from "../hooks/useDownloads"
import { Switch } from "react-native-paper"
import { useTheme } from "react-native-paper"

const ROOT: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
}

function getSwitchAccessibilityLabelState(state: AccumulatedDownloadState): string {
  switch (state.type) {
    case "UNKNOWN":
      return "unbekannter Herunterladzustand"
    case "NOT_DOWNLOADED":
      return "nicht heruntergeladen"
    case "DOWNLOADING":
    case "FINALIZING":
      return `beim Herunterladen: ${Math.round(state.progress * 100)}%`
    case "DOWNLOADED":
      return "heruntergeladen"
    case "CANCELLING":
      return "beim Abbrechen"
    case "DELETING":
      return "beim Löschen"
    case "FINALIZING_OR_CANCELLING_OR_DELETING":
      return "beim Herunterladen, Abbrechen oder Löschen"
  }
}

function getSwitchAccessibilityHintAction(action: AccumulatedTransitionAction): string {
  switch (action) {
    case AccumulatedTransitionAction.None:
      return "keine"
    case AccumulatedTransitionAction.Start:
      return "herunterladen"
    case AccumulatedTransitionAction.Cancel:
      return "abbrechen"
    case AccumulatedTransitionAction.Delete:
      return "löschen"
  }
}

export interface DownloadsSwitchProps {
  tracks: Track[]
}

export function DownloadsSwitch({ tracks }: DownloadsSwitchProps) {
  const {
    state: downloadState,
    requestedState: requestedDownloadState,
    failed: failedToSatisfyDownloadRequest,
    transition,
  } = useDownloads(tracks)

  const { colors } = useTheme()

  const colorProps = failedToSatisfyDownloadRequest
    ? {
        trackColor: { false: colors.error, true: colors.error },
        ios_backgroundColor: colors.error,
      }
    : {}

  return (
    <View style={ROOT}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${getSwitchAccessibilityLabelState(downloadState)}`}
        accessibilityHint={
          transition.action === AccumulatedTransitionAction.None
            ? undefined
            : `Aktion: ${getSwitchAccessibilityHintAction(transition.action)}`
        }
        accessibilityRole="switch"
        disabled={transition.action === AccumulatedTransitionAction.None}
        value={
          requestedDownloadState === "NONE"
            ? downloadState.type === "DOWNLOADED"
            : requestedDownloadState === "DOWNLOADED"
        }
        onValueChange={() => transition?.perform()}
        {...colorProps}
      />
      <Text accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
        {getSwitchAccessibilityLabelState(downloadState)}
      </Text>
      {__DEV__ && (
        <Text accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
          {getSwitchAccessibilityHintAction(transition.action)}
        </Text>
      )}
    </View>
  )
}
