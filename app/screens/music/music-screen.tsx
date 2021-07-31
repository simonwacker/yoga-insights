import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { useMusicStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const MusicScreen = () => {
  const music = useMusicStore(useCallback((state) => state.music, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList tracks={music} />
    </Screen>
  )
}
