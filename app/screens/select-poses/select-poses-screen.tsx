import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, SectionList, ListCheckboxItem, Button } from "../../components"
import { color } from "../../theme"
import { useTrackStore } from "../../stores"
import { SelectPosesScreenNavigationProp, SelectPosesScreenRouteProp } from "../../navigators"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

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

  return (
    <Screen style={ROOT} preset="fixed">
      <SectionList
        getSectionTitle={(section) => section.title}
        sections={poseSections}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListCheckboxItem
            label={getTrack(item).name}
            checked={selectedPoseIds.has(item)}
            onPress={() => togglePoseSelection(item)}
          />
        )}
      />
      <Button
        disabled={selectedPoseIds.size === 0}
        onPress={() =>
          navigation.navigate("orderPoses", {
            poseIds: Array.from(selectedPoseIds),
          })
        }
        title="Übungen sortieren"
      />
    </Screen>
  )
}
