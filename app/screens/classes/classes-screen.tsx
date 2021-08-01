import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { useClassStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const ClassesScreen = () => {
  const classes = useClassStore(useCallback((state) => state.classes, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList tracks={classes} />
    </Screen>
  )
}
