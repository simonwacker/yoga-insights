import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackSectionList } from "../../components"
import { PosesScreenNavigationProp, PosesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type PosesScreenProps = {
  route: PosesScreenRouteProp
  navigation: PosesScreenNavigationProp
}

export function PosesScreen({ navigation }: PosesScreenProps) {
  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))

  return (
    <Screen style={ROOT} preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <TrackSectionList
        sections={poseSections}
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
