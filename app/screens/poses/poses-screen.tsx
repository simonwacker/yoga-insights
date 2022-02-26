import React, { useCallback } from "react"
import { Screen, TrackSectionList } from "../../components"
import { TrackKind } from "../../models"
import { PosesScreenNavigationProp, PosesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"

export type PosesScreenProps = {
  route: PosesScreenRouteProp
  navigation: PosesScreenNavigationProp
}

export function PosesScreen({ navigation }: PosesScreenProps) {
  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <TrackSectionList
        sections={poseSections}
        onSelectTrack={(initialTrackIndex, trackIds) =>
          navigation.navigate("player", {
            trackKind: TrackKind.Pose,
            initialTrackIndex: initialTrackIndex,
            trackIds: trackIds,
            backgroundMusicId: null,
          })
        }
      />
    </Screen>
  )
}
