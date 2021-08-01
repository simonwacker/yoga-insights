import React, { useState } from "react"
import { ViewStyle } from "react-native"
import { Screen, AudioPlayer } from "../../components"
import { useRoute } from "@react-navigation/native"
import { color } from "../../theme"
import { PlayerScreenRouteProp } from "../../navigators"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const PlayerScreen = () => {
  const route = useRoute<PlayerScreenRouteProp>()
  const { initialTrackIndex, tracks } = route.params

  const [trackIndex, setTrackIndex] = useState(initialTrackIndex)
  const track = tracks[trackIndex]

  const playPreviousTrack = () => {
    if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1)
    }
  }

  const playNextTrack = () => {
    if (trackIndex + 1 < tracks.length) {
      setTrackIndex(trackIndex + 1)
    }
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <AudioPlayer
        track={track}
        onPlaybackDidJustFinish={playNextTrack}
        previousTrack={trackIndex >= 1 ? tracks[trackIndex - 1] : undefined}
        onPlayPreviousTrack={playPreviousTrack}
        nextTrack={trackIndex + 1 < tracks.length ? tracks[trackIndex + 1] : undefined}
        onPlayNextTrack={playNextTrack}
      />
    </Screen>
  )
}
