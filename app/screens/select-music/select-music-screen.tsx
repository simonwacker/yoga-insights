import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, SectionList, ListRadioItem, Button } from "../../components"
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

  const finish = () =>
    navigation.navigate("namePlaylist", { poseIds: poseIds, musicId: selectedMusicId })

  return (
    <Screen
      style={ROOT}
      preset="fixed"
      onAccessibilityEscape={navigation.goBack}
      onMagicTap={finish}
    >
      <SectionList
        accessibilityRole="radiogroup"
        getSectionTitle={(section) => section.title}
        sections={musicSections}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListRadioItem
            label={getTrack(item).name}
            selected={item === selectedMusicId}
            onPress={() => setSelectedMusicId(item)}
          />
        )}
      />
      <Button onPress={finish} title="Playlist benennen" />
    </Screen>
  )
}
