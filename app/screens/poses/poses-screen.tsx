import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const PosesScreen = () => {
  const poseSections = useTrackStore(useCallback((state) => state.poseSections, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList sections={poseSections} />
    </Screen>
  )
}
