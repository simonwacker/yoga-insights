import React from "react"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { useClasses } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const ClassesScreen = () => {
  const [classes] = useClasses()

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList tracks={classes} />
    </Screen>
  )
}
