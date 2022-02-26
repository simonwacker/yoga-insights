import React, { useCallback } from "react"
import { Screen, TrackSectionList } from "../../components"
import { TrackKind } from "../../models"
import { MusicScreenNavigationProp, MusicScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"

export type MusicScreenProps = {
  route: MusicScreenRouteProp
  navigation: MusicScreenNavigationProp
}

export function MusicScreen({ navigation }: MusicScreenProps) {
  const musicSections = useTrackStore(useCallback((state) => state.musicSections, []))

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack}>
      <TrackSectionList
        sections={musicSections}
        onSelectTrack={(initialTrackIndex, trackIds) =>
          navigation.navigate("player", {
            trackKind: TrackKind.Music,
            initialTrackIndex: initialTrackIndex,
            trackIds: trackIds,
            backgroundMusicId: null,
          })
        }
      />
    </Screen>
  )
}
