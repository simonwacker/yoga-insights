import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useCallback, useEffect, useState } from "react"
import { ViewStyle } from "react-native"
import { FAB } from "react-native-paper"
import { Screen, FlatList, ListCheckboxItem, CancelAction } from "../components"
import { OrderPosesScreenNavigationProp, OrderPosesScreenRouteProp } from "../navigators"
import { usePlaylistStore, useTrackStore } from "../stores"

const FAB_STYLE: ViewStyle = {
  position: "absolute",
  margin: 16,
  right: 0,
  bottom: 0,
}

export type OrderPosesScreenProps = {
  route: OrderPosesScreenRouteProp
  navigation: OrderPosesScreenNavigationProp
}

const keepIdsThatAreInSet = (ids: readonly string[], keep: Set<string>) =>
  ids.filter((id) => keep.has(id))

export function OrderPosesScreen({ route, navigation }: OrderPosesScreenProps) {
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
      />
      <FAB
        disabled={!canFinish}
        label="Hintergrundmusik auswählen"
        icon={(props) => <MaterialCommunityIcons name="chevron-right" {...props} />}
        onPress={finish}
        style={FAB_STYLE}
      />
    </Screen>
  )
}
