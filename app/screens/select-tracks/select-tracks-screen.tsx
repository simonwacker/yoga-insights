import React, { useCallback, useState } from "react"
import { Pressable, View, ViewStyle, TextStyle, SectionList, Button } from "react-native"
import { Screen, Text, TrackListCheckboxItem } from "../../components"
import { color, spacing } from "../../theme"
import { useTrackStore } from "../../stores"
import { SelectTracksScreenNavigationProp, SelectTracksScreenRouteProp } from "../../navigators"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

export type SelectTracksScreenProps = {
  route: SelectTracksScreenRouteProp
  navigation: SelectTracksScreenNavigationProp
}

export const SelectTracksScreen = ({ navigation }: SelectTracksScreenProps) => {
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
          <TrackListCheckboxItem
            label={getTrack(item).name}
            checked={selectedTrackIds.has(item)}
            onPress={() => toggleTrackSelection(item)}
          />
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
