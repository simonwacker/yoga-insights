import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useState, useCallback, useEffect } from "react"
import { Appbar } from "react-native-paper"
import { Screen, AudioPlayer } from "../components"
import { PlayerScreenNavigationProp, PlayerScreenRouteProp } from "../navigators"
import { useTrackStore } from "../stores"

export type PlayerScreenProps = {
  route: PlayerScreenRouteProp
  navigation: PlayerScreenNavigationProp
}

export function PlayerScreen({ route, navigation }: PlayerScreenProps) {
  const { section, initialTrackIndex, backgroundMusicId, playlistId } = route.params

  useEffect(() => {
    if (playlistId === undefined) {
      navigation.setOptions({ headerRight: undefined })
    } else {
      navigation.setOptions({
        headerRight: (props: any) => (
          <Appbar.Action
            {...props}
            accessibilityLabel="Playlist bearbeiten"
            accessibilityRole="button"
            accessible={true}
            icon={(props) => <MaterialCommunityIcons name="pencil" {...props} />}
            onPress={() => navigation.navigate("selectPoses", { playlistId: playlistId })}
            onMagicTap={() => navigation.navigate("selectPoses", { playlistId: playlistId })}
          />
        ),
      })
    }
  }, [navigation, playlistId])

  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [trackIndex, setTrackIndex] = useState(initialTrackIndex)
  const trackIds = section.data

  const playPreviousTrack = () => {
    if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1)
    }
  }

  const playNextTrack = () => {
    if (trackIndex + 1 < trackIds.length) {
      setTrackIndex(trackIndex + 1)
    }
  }

  return (
    <Screen preset="scroll" onAccessibilityEscape={navigation.goBack}>
      <AudioPlayer
        section={section}
        track={getTrack(trackIds[trackIndex])}
        backgroundMusic={backgroundMusicId === null ? undefined : getTrack(backgroundMusicId)}
        onPlaybackDidJustFinish={playNextTrack}
        previousTrack={trackIndex >= 1 ? getTrack(trackIds[trackIndex - 1]) : undefined}
        onPlayPreviousTrack={playPreviousTrack}
        nextTrack={
          trackIndex + 1 < trackIds.length ? getTrack(trackIds[trackIndex + 1]) : undefined
        }
        onPlayNextTrack={playNextTrack}
      />
    </Screen>
  )
}
