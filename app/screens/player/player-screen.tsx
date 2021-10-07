import React, { useState, useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, AudioPlayer } from "../../components"
import { color } from "../../theme"
import { PlayerScreenNavigationProp, PlayerScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type PlayerScreenProps = {
  route: PlayerScreenRouteProp
  navigation: PlayerScreenNavigationProp
}

export function PlayerScreen({ route }: PlayerScreenProps) {
  const { initialTrackIndex, trackIds, backgroundMusicId } = route.params

  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [trackIndex, setTrackIndex] = useState(initialTrackIndex)

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

  const getTracksToDownload = () => {
    let tracks = trackIds.map((trackId) => getTrack(trackId))
    if (backgroundMusicId === null) {
      return tracks
    }
    return [...tracks, getTrack(backgroundMusicId)]
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <AudioPlayer
        track={getTrack(trackIds[trackIndex])}
        backgroundMusic={backgroundMusicId === null ? undefined : getTrack(backgroundMusicId)}
        tracksToDownload={getTracksToDownload()}
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
