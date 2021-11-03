import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackSectionList } from "../../components"
import { MusicScreenNavigationProp, MusicScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type MusicScreenProps = {
  route: MusicScreenRouteProp
  navigation: MusicScreenNavigationProp
}

export function MusicScreen({ navigation }: MusicScreenProps) {
  const musicSections = useTrackStore(useCallback((state) => state.musicSections, []))

  return (
    <Screen style={ROOT} preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <TrackSectionList
        sections={musicSections}
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
