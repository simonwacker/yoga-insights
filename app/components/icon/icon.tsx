import * as React from "react"
import { StyleProp, ViewStyle, View, ImageStyle } from "react-native"
import { AutoImage as Image } from "../auto-image/auto-image"
import { IconTypes } from "./icons"
import { icons } from "./icons"

const ROOT: ImageStyle = {
  resizeMode: "contain",
}

export interface IconProps {
  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */

  containerStyle?: StyleProp<ViewStyle>

  /**
   * The name of the icon
   */

  icon: IconTypes
}

export function Icon(props: IconProps) {
  const { style: styleOverride, icon, containerStyle } = props

  return (
    <View style={containerStyle}>
      <Image style={[ROOT, styleOverride]} source={icons[icon]} />
    </View>
  )
}
