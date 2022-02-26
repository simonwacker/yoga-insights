import React from "react"
import { Track } from "../../models"
import { SwitchProps } from "react-native"
import { TransitionAction, DownloadState } from "../../clients/TrackDownloadsClient"
import { useDownload } from "../../hooks/useDownload"
import { List, Switch } from "react-native-paper"
import { useTheme } from "react-native-paper"

function convertDownloadStateToPhrase(state: DownloadState): string {
  switch (state.type) {
    case "UNKNOWN":
      return "Unbekannter Herunterladzustand"
    case "NOT_DOWNLOADED":
      return "Nicht heruntergeladen"
    case "DOWNLOADING":
    case "FINALIZING":
      return `Beim Herunterladen: ${Math.round(state.progress * 100)}%`
    case "DOWNLOADED":
      return "Heruntergeladen"
    case "CANCELLING":
      return "Beim Abbrechen"
    case "DELETING":
      return "Beim Löschen"
  }
}

function convertTransitionActionToPhrase(action: TransitionAction): string {
  switch (action) {
    case TransitionAction.None:
      return "Keine"
    case TransitionAction.Start:
      return "Herunterladen"
    case TransitionAction.Cancel:
      return "Abbrechen"
    case TransitionAction.Delete:
      return "Löschen"
  }
}

export interface DownloadSwitchProps {
  title: string
  track: Track
}

export function DownloadSwitch({ title, track }: DownloadSwitchProps) {
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
    <List.Item
      title={title}
      description={`Zustand: ${convertDownloadStateToPhrase(downloadState)}`}
      right={(props) => (
        <Switch
          {...props}
          accessible={true}
          accessibilityLabel={`Aktion: ${convertTransitionActionToPhrase(transition.action)}`}
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
      )}
    />
  )
}
