import React, { useCallback, useState } from "react"
import { Pressable, View, ViewStyle, TextStyle, SectionList, Button } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { usePoseStore } from "../../stores"
import { useNavigation } from "@react-navigation/native"
import { SelectTracksScreenNavigationProp } from "../../navigators"
import { Track } from "../../models"

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

const toIdList = (tracks: Set<Track>) => {
  const list = []
  for (const track of tracks) {
    list.push(track.trackId)
  }
  return list
}

export const SelectTracksScreen = () => {
  const navigation = useNavigation<SelectTracksScreenNavigationProp>()
  const poses = usePoseStore(useCallback((state) => state.poses, []))
  const [selectedTracks, setSelectedTracks] = useState(new Set<Track>())

  const toggleTrackSelection = (track: Track) => {
    const copy = new Set(selectedTracks)
    if (copy.has(track)) {
      copy.delete(track)
    } else {
      copy.add(track)
    }
    setSelectedTracks(copy)
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={poses}
        keyExtractor={(item) => item.trackId}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleTrackSelection(item)}>
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
      <Button
        onPress={() =>
          navigation.navigate("orderTracks", {
            trackIds: toIdList(selectedTracks),
          })
        }
        title="Übungen sortieren"
      />
    </Screen>
  )
}
