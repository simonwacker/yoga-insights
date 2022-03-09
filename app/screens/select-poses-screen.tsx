import React, { useCallback, useEffect, useState } from "react"
import { Screen, SectionList, ListCheckboxItem, Button, CancelAction } from "../components"
import { usePlaylistStore, useTrackStore } from "../stores"
import { SelectPosesScreenNavigationProp, SelectPosesScreenRouteProp } from "../navigators"

export type SelectPosesScreenProps = {
  route: SelectPosesScreenRouteProp
  navigation: SelectPosesScreenNavigationProp
}

export function SelectPosesScreen({ route, navigation }: SelectPosesScreenProps) {
  const { playlistId } = route.params

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

  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const getPlaylist = usePlaylistStore(useCallback((state) => state.getPlaylist, []))
  const playlist = playlistId === undefined ? null : getPlaylist(playlistId)
  const [selectedPoseIds, setSelectedPoseIds] = useState(
    () => new Set<string>(playlist?.poseIds ?? []),
  )

  const togglePoseSelection = (poseId: string) => {
    const copy = new Set(selectedPoseIds)
    if (copy.has(poseId)) {
      copy.delete(poseId)
    } else {
      copy.add(poseId)
    }
    setSelectedPoseIds(copy)
  }

  const canFinish = selectedPoseIds.size >= 1

  const finish = () => {
    if (canFinish) {
      navigation.navigate("orderPoses", {
        poseIds: Array.from(selectedPoseIds),
        playlistId: playlistId,
      })
    }
  }

  return (
    <Screen preset="scroll" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <SectionList
        sections={poseSections}
        renderItem={({ item }) => (
          <ListCheckboxItem
            key={item}
            label={getTrack(item).name}
            checked={selectedPoseIds.has(item)}
            onPress={() => togglePoseSelection(item)}
          />
        )}
      />
      <Button disabled={!canFinish} onPress={finish} title="Übungen sortieren" />
    </Screen>
  )
}
