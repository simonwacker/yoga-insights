import React, { useState } from "react"
import { Pressable, View, ViewStyle, TextStyle, SectionList, Button, TextInput } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { usePlaylistStore, usePoseStore } from "../../stores"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: 10,
}
const LIST_TEXT: TextStyle = {
  marginLeft: 10,
}
const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

export const SelectTracksScreen = () => {
  const playlistStore = usePlaylistStore()
  const { poses } = usePoseStore()

  const [selection, setSelection] = useState(new Set<string>())
  const [name, setName] = useState("")

  const toggleTrackSelection = (trackId: string) => {
    const newSet = new Set(selection)
    if (selection.has(trackId)) {
      newSet.delete(trackId)
    } else {
      newSet.add(trackId)
    }
    setSelection(newSet)
  }

  const createPlaylist = () => {
    playlistStore.dispatch({
      type: "addPlaylist",
      playlist: { name: name, trackIds: Array.from(selection) },
    })
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={poses.inSections}
        keyExtractor={(item) => item.trackId}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleTrackSelection(item.trackId)}>
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
      <TextInput accessibilityLabel="Name" value={name} onChangeText={setName} />
      <Button onPress={createPlaylist} title="Create Playlist" />
    </Screen>
  )
}
