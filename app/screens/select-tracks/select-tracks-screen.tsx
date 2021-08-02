import React, { useCallback, useState } from "react"
import { Pressable, View, ViewStyle, TextStyle, SectionList, Button } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useTrackStore } from "../../stores"
import { useNavigation } from "@react-navigation/native"
import { SelectTracksScreenNavigationProp } from "../../navigators"

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
  const navigation = useNavigation<SelectTracksScreenNavigationProp>()
  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [selectedTrackIds, setSelectedTrackIds] = useState(new Set<string>())

  const toggleTrackSelection = (trackId: string) => {
    const copy = new Set(selectedTrackIds)
    if (copy.has(trackId)) {
      copy.delete(trackId)
    } else {
      copy.add(trackId)
    }
    setSelectedTrackIds(copy)
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={poseSections}
        keyExtractor={(item) => item}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleTrackSelection(item)}>
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{getTrack(item).name}</Text>
            </View>
          </Pressable>
        )}
      />
      <Button
        onPress={() =>
          navigation.navigate("orderTracks", {
            trackIds: Array.from(selectedTrackIds),
          })
        }
        title="Übungen sortieren"
      />
    </Screen>
  )
}
