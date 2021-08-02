import React from "react"
import { ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { SettingsScreenNavigationProp, SettingsScreenRouteProp } from "../../navigators"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export type SettingsScreenProps = {
  route: SettingsScreenRouteProp
  navigation: SettingsScreenNavigationProp
}

export function SettingsScreen({}: SettingsScreenProps) {
  return (
    <Screen style={ROOT} preset="scroll">
      <Text preset="header" text="" />
    </Screen>
  )
}
