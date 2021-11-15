import React, { useCallback } from "react"
import { Screen, TrackSectionList } from "../../components"
import { ClassesScreenNavigationProp, ClassesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"

export type ClassesScreenProps = {
  route: ClassesScreenRouteProp
  navigation: ClassesScreenNavigationProp
}

export function ClassesScreen({ navigation }: ClassesScreenProps) {
  const classSections = useTrackStore(useCallback((state) => state.classSections, []))

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <TrackSectionList
        sections={classSections}
        onSelectTrack={(initialTrackIndex, trackIds) =>
          navigation.navigate("player", {
            initialTrackIndex: initialTrackIndex,
            trackIds: trackIds,
            backgroundMusicId: null,
          })
        }
      />
    </Screen>
  )
}
