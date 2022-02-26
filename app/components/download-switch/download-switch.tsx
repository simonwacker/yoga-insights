import React from "react"
import { Track } from "../../models"
import { SwitchProps, View, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { TransitionAction, DownloadState } from "../../clients/TrackDownloadsClient"
import { useDownload } from "../../hooks/useDownload"
import { Switch } from "react-native-paper"
import { useTheme } from "react-native-paper"

const ROOT: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
}

function convertDownloadStateToPhrase(state: DownloadState): string {
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
  }
}

function convertTransitionActionToPhrase(action: TransitionAction): string {
  switch (action) {
    case TransitionAction.None:
      return "keine"
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
  const {
    state: downloadState,
    requestedState: requestedDownloadState,
    failed: failedToSatisfyDownloadRequest,
    transition,
  } = useDownload(track)

  const { colors } = useTheme()

  const colorProps: Pick<SwitchProps, "trackColor" | "ios_backgroundColor"> =
    failedToSatisfyDownloadRequest
      ? {
          trackColor: { false: colors.error, true: colors.error },
          ios_backgroundColor: colors.error,
        }
      : {}

  return (
    <View style={ROOT}>
      <Switch
        accessible={true}
        accessibilityLabel={`Zustand: ${convertDownloadStateToPhrase(downloadState)}`}
        accessibilityHint={
          transition.action === TransitionAction.None
            ? undefined
            : `Aktion: ${convertTransitionActionToPhrase(transition.action)}`
        }
        accessibilityRole="switch"
        disabled={transition.action === TransitionAction.None}
        value={
          requestedDownloadState === "NONE"
            ? transition.action !== TransitionAction.None &&
              transition.action !== TransitionAction.Start
            : requestedDownloadState === "DOWNLOADED"
        }
        onValueChange={() => transition.perform()}
        {...colorProps}
      />
      <Text accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
        {convertDownloadStateToPhrase(downloadState)}
      </Text>
      {__DEV__ && (
        <Text accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
          {convertTransitionActionToPhrase(transition.action)}
        </Text>
      )}
    </View>
  )
}
