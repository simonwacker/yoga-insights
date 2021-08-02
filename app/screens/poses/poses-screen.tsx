import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackSectionList } from "../../components"
import { PosesScreenNavigationProp, PosesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export type PosesScreenProps = {
  route: PosesScreenRouteProp
  navigation: PosesScreenNavigationProp
}

export const PosesScreen = ({ navigation }: PosesScreenProps) => {
  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackSectionList
        sections={poseSections}
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
