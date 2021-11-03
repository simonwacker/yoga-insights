import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Button, Screen, FlatList, ListCheckboxItem } from "../../components"
import { OrderPosesScreenNavigationProp, OrderPosesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

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

  return (
    <Screen style={ROOT} preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <FlatList
        data={poseIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListCheckboxItem
            label={`${getTrack(item).name} (${orderedPoseIds.indexOf(item)})`}
            checked={orderedPoseIds.includes(item)}
            onPress={() => pushOrDeletePose(item)}
          />
        )}
      />
      <Button
        disabled={poseIds.length !== orderedPoseIds.length}
        onPress={() => navigation.navigate("selectMusic", { poseIds: orderedPoseIds })}
        title="Hintergrundmusik auswählen"
      />
    </Screen>
  )
}
