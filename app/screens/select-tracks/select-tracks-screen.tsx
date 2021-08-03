import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, SectionList, ListCheckboxItem, Button } from "../../components"
import { color, spacing } from "../../theme"
import { useTrackStore } from "../../stores"
import { SelectTracksScreenNavigationProp, SelectTracksScreenRouteProp } from "../../navigators"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}
const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing.medium,
}

export type SelectTracksScreenProps = {
  route: SelectTracksScreenRouteProp
  navigation: SelectTracksScreenNavigationProp
}

export function SelectTracksScreen({ navigation }: SelectTracksScreenProps) {
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
        getSectionTitle={(section) => section.title}
        contentContainerStyle={SECTION_LIST}
        sections={poseSections}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListCheckboxItem
            label={getTrack(item).name}
            checked={selectedTrackIds.has(item)}
            onPress={() => toggleTrackSelection(item)}
          />
        )}
      />
      <Button
        disabled={selectedTrackIds.size === 0}
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
