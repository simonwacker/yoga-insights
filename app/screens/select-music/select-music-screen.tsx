import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, SectionList, ListCheckboxItem, Button } from "../../components"
import { color } from "../../theme"
import { useTrackStore } from "../../stores"
import { SelectMusicScreenNavigationProp, SelectMusicScreenRouteProp } from "../../navigators"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type SelectMusicScreenProps = {
  route: SelectMusicScreenRouteProp
  navigation: SelectMusicScreenNavigationProp
}

export function SelectMusicScreen({ route, navigation }: SelectMusicScreenProps) {
  const { poseIds } = route.params

  const musicSections = useTrackStore(useCallback((state) => state.musicSections, []))
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(null)

  return (
    <Screen style={ROOT} preset="fixed">
      <SectionList
        getSectionTitle={(section) => section.title}
        sections={musicSections}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListCheckboxItem
            label={getTrack(item).name}
            checked={item === selectedMusicId}
            onPress={() => setSelectedMusicId(item)}
          />
        )}
      />
      <Button
        onPress={() =>
          navigation.navigate("namePlaylist", { poseIds: poseIds, musicId: selectedMusicId })
        }
        title="Playlist benennen"
      />
    </Screen>
  )
}
