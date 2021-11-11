import React, { useCallback, useState } from "react"
import { Screen, SectionList, ListCheckboxItem, Button } from "../../components"
import { useTrackStore } from "../../stores"
import { SelectPosesScreenNavigationProp, SelectPosesScreenRouteProp } from "../../navigators"

export type SelectPosesScreenProps = {
  route: SelectPosesScreenRouteProp
  navigation: SelectPosesScreenNavigationProp
}

export function SelectPosesScreen({ navigation }: SelectPosesScreenProps) {
  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [selectedPoseIds, setSelectedPoseIds] = useState(new Set<string>())

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
      })
    }
  }

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <SectionList
        sections={poseSections}
        renderItem={({ item }) => (
          <ListCheckboxItem
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
