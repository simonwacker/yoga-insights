import React from "react"
import { Track } from "../models"
import { SwitchProps } from "react-native"
import {
  AccumulatedDownloadState,
  AccumulatedTransitionAction,
  useDownloads,
} from "../hooks/useDownloads"
import { List, Switch } from "react-native-paper"
import { useTheme } from "react-native-paper"

function convertDownloadStateToPhrase(state: AccumulatedDownloadState): string {
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
    case "FINALIZING_OR_CANCELLING_OR_DELETING":
      return "Beim Herunterladen, Abbrechen oder Löschen"
  }
}

function convertTransitionActionToPhrase(action: AccumulatedTransitionAction): string {
  switch (action) {
    case AccumulatedTransitionAction.None:
      return "Keine"
    case AccumulatedTransitionAction.Start:
      return "Herunterladen"
    case AccumulatedTransitionAction.Cancel:
      return "Abbrechen"
    case AccumulatedTransitionAction.Delete:
      return "Löschen"
  }
}

export interface DownloadsSwitchProps {
  title: string
  tracks: Track[]
}

export function DownloadsSwitch({ title, tracks }: DownloadsSwitchProps) {
  const {
    state: downloadState,
    requestedState: requestedDownloadState,
    failed: failedToSatisfyDownloadRequest,
    transition,
  } = useDownloads(tracks)

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
          disabled={transition.action === AccumulatedTransitionAction.None}
          value={
            requestedDownloadState === "NONE"
              ? transition.action !== AccumulatedTransitionAction.None &&
                transition.action !== AccumulatedTransitionAction.Start
              : requestedDownloadState === "DOWNLOADED"
          }
          onValueChange={() => transition?.perform()}
          {...colorProps}
        />
      )}
    />
  )
}
