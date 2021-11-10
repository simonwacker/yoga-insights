import React, { useCallback, useState } from "react"
import { useEffect } from "react"
import { ViewStyle } from "react-native"
import * as FileSystem from "expo-file-system"
import { Button, Screen, Text } from "../../components"
import { SettingsScreenNavigationProp, SettingsScreenRouteProp } from "../../navigators"
import { usePlaylistStore } from "../../stores"
import { color } from "../../theme"
import { tracksDirectoryUri } from "../../utils/file"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type SettingsScreenProps = {
  route: SettingsScreenRouteProp
  navigation: SettingsScreenNavigationProp
}

function getTracksDirectoryInfo() {
  return FileSystem.getInfoAsync(tracksDirectoryUri)
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [tracksDirectoryInfo, setTracksDirectoryInfo] = useState<FileSystem.FileInfo | null>(null)
  const playlists = usePlaylistStore(useCallback((state) => state.playlists, []))
  const clearPlaylists = usePlaylistStore(useCallback((state) => state.clearPlaylists, []))

  useEffect(() => {
    ;(async () => {
      setTracksDirectoryInfo(await getTracksDirectoryInfo())
    })()
  }, [])

  // TODO: This has to go through the TracksClient, otherwise the cache might
  // become stale and display tracks as downloaded even though the entire
  // directory has been deleted.
  const clearDownloads = async () => {
    await FileSystem.deleteAsync(tracksDirectoryUri)
    await FileSystem.makeDirectoryAsync(tracksDirectoryUri, { intermediates: true })
    setTracksDirectoryInfo(await getTracksDirectoryInfo())
  }

  return (
    <Screen style={ROOT} preset="scroll" onAccessibilityEscape={navigation.goBack}>
      {tracksDirectoryInfo?.exists ? (
        <Text
          text={`Der Speicherbedarf aller Downloads beträgt ${Math.round(
            tracksDirectoryInfo.size / 1000000,
          )} Megabyte`}
        />
      ) : (
        <Text text={"Der Speicherbedarf aller Downloads wird gerade bestimmt."} />
      )}
      <Button title="Alle Downloads löschen" onPress={clearDownloads} />
      <Text text={`Du hast ${playlists.length} Playlist${playlists.length === 1 ? "" : "s"}.`} />
      <Button title="Alle Playlists löschen" onPress={clearPlaylists} />
    </Screen>
  )
}
