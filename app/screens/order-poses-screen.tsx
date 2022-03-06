import React, { useCallback, useState } from "react"
import { Button, Screen, FlatList, ListCheckboxItem } from "../components"
import { OrderPosesScreenNavigationProp, OrderPosesScreenRouteProp } from "../navigators"
import { usePlaylistStore, useTrackStore } from "../stores"

export type OrderPosesScreenProps = {
  route: OrderPosesScreenRouteProp
  navigation: OrderPosesScreenNavigationProp
}

const keepIdsThatAreInSet = (ids: readonly string[], keep: Set<string>) =>
  ids.filter((id) => keep.has(id))

export function OrderPosesScreen({ route, navigation }: OrderPosesScreenProps) {
  const { poseIds, playlistId } = route.params

  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const getPlaylist = usePlaylistStore(useCallback((state) => state.getPlaylist, []))
  const playlist = playlistId === undefined ? null : getPlaylist(playlistId)
  const [orderedPoseIds, setOrderedPoseIds] = useState(() =>
    playlist === null
      ? new Array<string>()
      : keepIdsThatAreInSet(playlist.poseIds, new Set(poseIds)),
  )

  const pushOrDeletePose = (poseId: string) => {
    const copy = [...orderedPoseIds]
    const index = copy.indexOf(poseId)
    if (index === -1) {
      copy.push(poseId)
    } else {
      copy.splice(index, 1)
    }
    setOrderedPoseIds(copy)
  }

  const canFinish = poseIds.length === orderedPoseIds.length

  const finish = () => {
    if (canFinish) {
      navigation.navigate("selectMusic", { poseIds: orderedPoseIds, playlistId: playlistId })
    }
  }

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <FlatList
        data={poseIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListCheckboxItem
            label={`${orderedPoseIds.indexOf(item) + 1}. ${getTrack(item).name}`}
            checked={orderedPoseIds.includes(item)}
            onPress={() => pushOrDeletePose(item)}
          />
        )}
        ListFooterComponent={
          <Button disabled={!canFinish} onPress={finish} title="Hintergrundmusik auswählen" />
        }
      />
    </Screen>
  )
}
