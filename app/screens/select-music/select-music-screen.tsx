import React, { useCallback, useState } from "react"
import { Screen, SectionList, ListRadioItem, Button } from "../../components"
import { useTrackStore } from "../../stores"
import { SelectMusicScreenNavigationProp, SelectMusicScreenRouteProp } from "../../navigators"

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
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <SectionList
        accessibilityRole="radiogroup"
        sections={musicSections}
        renderItem={({ item }) => (
          <ListRadioItem
            label={getTrack(item).name}
            value={item}
            selected={item === selectedMusicId}
            onPress={() => setSelectedMusicId(item)}
          />
        )}
      />
      <Button onPress={finish} title="Playlist benennen" />
    </Screen>
  )
}
