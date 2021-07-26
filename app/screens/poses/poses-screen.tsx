import React from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { usePoseStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const PosesScreen = () => {
  const { poses } = usePoseStore()

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList tracks={poses.inSections} />
    </Screen>
  )
}
