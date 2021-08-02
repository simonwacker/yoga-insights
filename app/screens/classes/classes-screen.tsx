import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { ClassesScreenNavigationProp, ClassesScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export type ClassesScreenProps = {
  route: ClassesScreenRouteProp
  navigation: ClassesScreenNavigationProp
}

export const ClassesScreen = ({ navigation }: ClassesScreenProps) => {
  const classSections = useTrackStore(useCallback((state) => state.classSections, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList
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
