import React, { useCallback, useEffect, useState } from "react"
import { Screen, SectionList, ListRadioItem, CancelAction } from "../components"
import { usePlaylistStore, useTrackStore } from "../stores"
import { SelectMusicScreenNavigationProp, SelectMusicScreenRouteProp } from "../navigators"
import { ViewStyle } from "react-native"
import { FAB } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const FAB_STYLE: ViewStyle = {
  position: "absolute",
  margin: 16,
  right: 0,
  bottom: 0,
}

export type SelectMusicScreenProps = {
  route: SelectMusicScreenRouteProp
  navigation: SelectMusicScreenNavigationProp
}

export function SelectMusicScreen({ route, navigation }: SelectMusicScreenProps) {
  const { poseIds, playlistId } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <CancelAction
          onPress={() => navigation.navigate("tabs", { screen: "playlists" })}
          props={props}
        />
      ),
    })
    return () => navigation.setOptions({ headerRight: undefined })
  }, [navigation])

  const musicSections = useTrackStore(useCallback((state) => state.musicSections, []))
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const getPlaylist = usePlaylistStore(useCallback((state) => state.getPlaylist, []))
  const playlist = playlistId === undefined ? null : getPlaylist(playlistId)
  const [selectedMusicId, setSelectedMusicId] = useState<string | null>(
    () => playlist?.musicId ?? null,
  )

  const finish = () =>
    navigation.navigate("namePlaylist", {
      poseIds: poseIds,
      musicId: selectedMusicId,
      playlistId: playlistId,
    })

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <SectionList
        accessibilityRole="radiogroup"
        sections={musicSections}
        renderItem={({ item }) => (
          <ListRadioItem
            key={item}
            label={getTrack(item).name}
            value={item}
            selected={item === selectedMusicId}
            onPress={() => setSelectedMusicId(item)}
          />
        )}
      />
      <FAB
        label="Playlist benennen"
        icon={(props) => <MaterialCommunityIcons name="chevron-right" {...props} />}
        onPress={finish}
        style={FAB_STYLE}
      />
    </Screen>
  )
}
