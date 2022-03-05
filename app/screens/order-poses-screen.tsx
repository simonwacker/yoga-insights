import React, { useCallback, useState } from "react"
import { Button, Screen, FlatList, ListCheckboxItem } from "../components"
import { OrderPosesScreenNavigationProp, OrderPosesScreenRouteProp } from "../navigators"
import { useTrackStore } from "../stores"

export type OrderPosesScreenProps = {
  route: OrderPosesScreenRouteProp
  navigation: OrderPosesScreenNavigationProp
}

export function OrderPosesScreen({ route, navigation }: OrderPosesScreenProps) {
  const { poseIds } = route.params

  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [orderedPoseIds, setOrderedPoseIds] = useState(new Array<string>())

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
      navigation.navigate("selectMusic", { poseIds: orderedPoseIds })
    }
  }

  return (
    <Screen preset="scroll" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
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
      <Button disabled={!canFinish} onPress={finish} title="Hintergrundmusik auswählen" />
    </Screen>
  )
}
