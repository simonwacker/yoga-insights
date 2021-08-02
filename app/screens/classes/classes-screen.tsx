import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackSectionList } from "../../components"
import { ClassesScreenNavigationProp, ClassesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type ClassesScreenProps = {
  route: ClassesScreenRouteProp
  navigation: ClassesScreenNavigationProp
}

export function ClassesScreen({ navigation }: ClassesScreenProps) {
  const classSections = useTrackStore(useCallback((state) => state.classSections, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackSectionList
        sections={classSections}
        onSelectTrack={(initialTrackIndex, trackIds) =>
          navigation.navigate("player", {
            initialTrackIndex: initialTrackIndex,
            trackIds: trackIds,
          })
        }
      />
    </Screen>
  )
}
