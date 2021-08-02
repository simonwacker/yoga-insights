import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Button, Screen, TextField } from "../../components"
import { NamePlaylistScreenNavigationProp, NamePlaylistScreenRouteProp } from "../../navigators"
import { usePlaylistStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type NamePlaylistScreenProps = {
  route: NamePlaylistScreenRouteProp
  navigation: NamePlaylistScreenNavigationProp
}

export function NamePlaylistScreen({ route, navigation }: NamePlaylistScreenProps) {
  const { trackIds } = route.params

  const [name, setName] = useState("")
  const addPlaylist = usePlaylistStore(useCallback((state) => state.addPlaylist, []))

  const createPlaylist = () => {
    addPlaylist({ name: name, trackIds: trackIds })
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <TextField accessibilityLabel="Name" value={name} onChangeText={setName} />
      <Button
        onPress={() => {
          createPlaylist()
          navigation.navigate("tabs", { screen: "playlists" })
        }}
        title="Playlist erstellen"
      />
    </Screen>
  )
}
