import React, { useState, useCallback } from "react"
import { Screen, AudioPlayer } from "../../components"
import { PlayerScreenNavigationProp, PlayerScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"

export type PlayerScreenProps = {
  route: PlayerScreenRouteProp
  navigation: PlayerScreenNavigationProp
}

export function PlayerScreen({ route, navigation }: PlayerScreenProps) {
  const { trackKind, initialTrackIndex, trackIds, backgroundMusicId } = route.params

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
    <Screen preset="scroll" onAccessibilityEscape={navigation.goBack}>
      <AudioPlayer
        tracksKind={trackKind}
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
