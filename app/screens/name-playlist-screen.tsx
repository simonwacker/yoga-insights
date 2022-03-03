import React, { useCallback, useState } from "react"
import { Button, Screen, TextField } from "../components"
import { NamePlaylistScreenNavigationProp, NamePlaylistScreenRouteProp } from "../navigators"
import { usePlaylistStore } from "../stores"

export type NamePlaylistScreenProps = {
  route: NamePlaylistScreenRouteProp
  navigation: NamePlaylistScreenNavigationProp
}

export function NamePlaylistScreen({ route, navigation }: NamePlaylistScreenProps) {
  const { poseIds, musicId } = route.params

  const [name, setName] = useState("")
  const addPlaylist = usePlaylistStore(useCallback((state) => state.addPlaylist, []))

  const createPlaylist = () => {
    addPlaylist({ name: name, poseIds: poseIds, musicId: musicId })
  }

  const canFinish = name !== ""

  const finish = () => {
    if (canFinish) {
      createPlaylist()
      navigation.navigate("tabs", { screen: "playlists" })
    }
  }

  return (
    <Screen preset="scroll" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <TextField
        accessibilityLabel="Name"
        value={name}
        onChangeText={setName}
        onMagicTap={finish}
        label="Name"
      />
      <Button disabled={!canFinish} onPress={finish} title="Playlist erstellen" />
    </Screen>
  )
}
