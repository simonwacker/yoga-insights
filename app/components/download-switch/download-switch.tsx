import React, { useCallback, useEffect, useState } from "react"
import { DownloadSwitchProps } from "./download-switch.props"
import { Switch, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { scale } from "../../theme/scale"
import {
  DownloadStatus,
  DownloadStatusWishedFor,
  toDownloadStatusToBe,
  useDownloadStore,
} from "../../stores"
import shallow from "zustand/shallow"

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

enum DownloadSwitchStatus {
  Unknown = "UNKNOWN",
  Deleting = "DELETING",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloading = "DOWNLOADING",
  Downloaded = "DOWNLOADED",
}

function any<ValueType>(values: Iterable<ValueType>, predicate: (value: ValueType) => boolean) {
  for (const value of values) {
    if (predicate(value)) {
      return true
    }
  }
  return false
}

function all<ValueType>(values: Iterable<ValueType>, predicate: (value: ValueType) => boolean) {
  for (const value of values) {
    if (!predicate(value)) {
      return false
    }
  }
  return true
}

function getSwitchStatus(statuses: Iterable<DownloadStatus>) {
  const statusesToBe = []
  for (const status of statuses) {
    statusesToBe.push(toDownloadStatusToBe(status))
  }
  if (any(statusesToBe, (status) => status === DownloadStatus.Unknown)) {
    return DownloadSwitchStatus.Unknown
  }
  if (all(statusesToBe, (status) => status === DownloadStatus.Downloaded)) {
    return DownloadSwitchStatus.Downloaded
  }
  if (
    all(
      statusesToBe,
      (status) => status === DownloadStatus.Downloading || status === DownloadStatus.Downloaded,
    )
  ) {
    return DownloadSwitchStatus.Downloading
  }
  if (all(statusesToBe, (status) => status === DownloadStatus.NotDownloaded)) {
    return DownloadSwitchStatus.NotDownloaded
  }
  if (
    all(
      statusesToBe,
      (status) => status === DownloadStatus.Deleting || status == DownloadStatus.NotDownloaded,
    )
  ) {
    return DownloadSwitchStatus.Deleting
  }
  if (any(statusesToBe, (status) => status === DownloadStatus.NotDownloaded)) {
    return DownloadSwitchStatus.NotDownloaded
  }
  return DownloadSwitchStatus.Unknown
}

function computeProgressPercentage(progressPercentages: Map<string, number>) {
  let sum = 0
  for (const value of progressPercentages.values()) {
    sum += value
  }
  return sum / progressPercentages.size
}

export function DownloadSwitch({
  tracks,
  onDownloadComplete,
  onDownloadJustAboutToBeDeleted,
}: DownloadSwitchProps) {
  const [progressPercentage, setProgressPercentage] = useState(0)

  const downloadStatuses = useDownloadStore(
    useCallback((state) => tracks.map((track) => state.getStatus(track.trackId)), [tracks]),
    shallow,
  )
  const wishForDownloadStatus = useDownloadStore(useCallback((state) => state.wishForStatus, []))

  const switchStatus = getSwitchStatus(downloadStatuses)

  const determineDownloadStatus = useDownloadStore(
    useCallback((state) => state.determineStatus, []),
  )

  const addUpdateTrackProgressPercentageCallback = useDownloadStore(
    useCallback((state) => state.addUpdateTrackProgressPercentageCallback, []),
  )
  const removeUpdateTrackProgressPercentageCallback = useDownloadStore(
    useCallback((state) => state.removeUpdateTrackProgressPercentageCallback, []),
  )

  const addOnDownloadCompleteCallback = useDownloadStore(
    useCallback((state) => state.addOnDownloadCompleteCallback, []),
  )
  const removeOnDownloadCompleteCallback = useDownloadStore(
    useCallback((state) => state.removeOnDownloadCompleteCallback, []),
  )

  const addOnDownloadJustAboutToBeDeletedCallback = useDownloadStore(
    useCallback((state) => state.addOnDownloadJustAboutToBeDeletedCallback, []),
  )
  const removeOnDownloadJustAboutToBeDeletedCallback = useDownloadStore(
    useCallback((state) => state.removeOnDownloadJustAboutToBeDeletedCallback, []),
  )

  // TODO We currently update these maps' values directly without changing the
  // map, that is, we do not use the setters returned by `useState`. Doing
  // otherwise required me to seemingly unnecessarily copy that map before each
  // update. There probably is some benefit to doing this though. What are the
  // advantages and disadvantages?
  const [progressPercentages] = useState<Map<string, number>>(
    () => new Map(tracks.map((track) => [track.trackId, 0])),
  )

  const updateTrackProgressPercentage = (trackId: string, percentage: number) => {
    if (progressPercentages.get(trackId) !== percentage) {
      progressPercentages.set(trackId, percentage)
      setProgressPercentage(computeProgressPercentage(progressPercentages))
    }
  }

  const wishForDownloadStatuses = async (statusWishedFor: DownloadStatusWishedFor) => {
    __DEV__ && console.log(`Wishing for status ${statusWishedFor}`)
    await Promise.all(tracks.map((track) => wishForDownloadStatus(track, statusWishedFor)))
  }

  useEffect(() => {
    for (const track of tracks) {
      addUpdateTrackProgressPercentageCallback(track.trackId, updateTrackProgressPercentage)
    }
    return () => {
      for (const track of tracks) {
        removeUpdateTrackProgressPercentageCallback(track.trackId, updateTrackProgressPercentage)
      }
    }
  }, [
    tracks,
    addUpdateTrackProgressPercentageCallback,
    removeUpdateTrackProgressPercentageCallback,
  ])

  useEffect(() => {
    for (const track of tracks) {
      addOnDownloadCompleteCallback(track.trackId, onDownloadComplete)
    }
    return () => {
      for (const track of tracks) {
        removeOnDownloadCompleteCallback(track.trackId, onDownloadComplete)
      }
    }
  }, [tracks, onDownloadComplete, onDownloadJustAboutToBeDeleted])

  useEffect(() => {
    for (const track of tracks) {
      addOnDownloadJustAboutToBeDeletedCallback(track.trackId, onDownloadJustAboutToBeDeleted)
    }
    return () => {
      for (const track of tracks) {
        removeOnDownloadJustAboutToBeDeletedCallback(track.trackId, onDownloadJustAboutToBeDeleted)
      }
    }
  }, [
    tracks,
    addOnDownloadJustAboutToBeDeletedCallback,
    removeOnDownloadJustAboutToBeDeletedCallback,
  ])

  useEffect(() => {
    Promise.all(tracks.map(async (track) => determineDownloadStatus(track)))
  }, [tracks, determineDownloadStatus])

  const doSwitchStatus = async () => {
    try {
      switch (switchStatus) {
        case DownloadSwitchStatus.Unknown:
          await Promise.reject("Switched status in unknown status --- impossible!")
          break
        case DownloadSwitchStatus.Deleting:
        case DownloadSwitchStatus.NotDownloaded:
          await wishForDownloadStatuses(DownloadStatusWishedFor.Downloaded)
          break
        case DownloadSwitchStatus.Downloading:
        case DownloadSwitchStatus.Downloaded:
          await wishForDownloadStatuses(DownloadStatusWishedFor.NotDownloaded)
          break
      }
    } catch (error) {
      __DEV__ && console.error("Failed to switch status.", error)
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
