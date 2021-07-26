import React from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const OrderTracksScreen = () => {
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="" />
    </Screen>
  )
}
