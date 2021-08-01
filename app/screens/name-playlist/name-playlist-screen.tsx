import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { Button, TextInput, ViewStyle } from "react-native"
import { Screen } from "../../components"
import { NamePlaylistScreenNavigationProp, NamePlaylistScreenRouteProp } from "../../navigators"
import { usePlaylistStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const NamePlaylistScreen = () => {
  const navigation = useNavigation<NamePlaylistScreenNavigationProp>()
  const route = useRoute<NamePlaylistScreenRouteProp>()
  const { trackIds } = route.params

  const [name, setName] = useState("")
  const addPlaylist = usePlaylistStore(useCallback((state) => state.addPlaylist, []))

  const createPlaylist = () => {
    addPlaylist({ name: name, trackIds: trackIds })
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <TextInput accessibilityLabel="Name" value={name} onChangeText={setName} />
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
