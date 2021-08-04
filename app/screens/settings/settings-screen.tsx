import React, { useState } from "react"
import { useEffect } from "react"
import { ViewStyle } from "react-native"
import { FileSystem } from "react-native-unimodules"
import { Button, Screen, Text } from "../../components"
import { SettingsScreenNavigationProp, SettingsScreenRouteProp } from "../../navigators"
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

export function SettingsScreen({}: SettingsScreenProps) {
  const [tracksDirectoryInfo, setTracksDirectoryInfo] = useState<FileSystem.FileInfo | null>(null)

  useEffect(() => {
    ;(async () => {
      setTracksDirectoryInfo(await getTracksDirectoryInfo())
    })()
  }, [])

  const clearDownloads = async () => {
    await FileSystem.deleteAsync(tracksDirectoryUri)
    await FileSystem.makeDirectoryAsync(tracksDirectoryUri, { intermediates: true })
    setTracksDirectoryInfo(await getTracksDirectoryInfo())
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="Einstellungen" />
      <Text
        text={`Der Speicherbedarf aller Downloads beträgt ${Math.round(
          tracksDirectoryInfo.size / 1000000,
        )} Megabyte`}
      />
      <Button title="Alle Downloads löschen" onPress={clearDownloads} />
    </Screen>
  )
}
