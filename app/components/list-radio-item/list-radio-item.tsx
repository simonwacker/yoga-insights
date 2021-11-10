import * as React from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { color, spacing } from "../../theme"
import { Text } from "../text/text"

const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: spacing.small,
  alignSelf: "flex-start",
}
const DISC_DIMENSIONS = { width: 16, height: 16 }
const DISC_OUTLINE: ViewStyle = {
  ...DISC_DIMENSIONS,
  marginTop: 2, // finicky and will depend on font/line-height/baseline/weather
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 2,
  borderColor: color.primaryDarker,
  borderRadius: 8,
}
const DISC_FILL: ViewStyle = {
  width: DISC_DIMENSIONS.width - 8,
  height: DISC_DIMENSIONS.height - 8,
  borderColor: color.primary,
  borderWidth: 4,
  borderRadius: 4,
}
const LIST_TEXT: TextStyle = {
  marginLeft: spacing.small,
}

export interface ListRadioItemProps {
  label: string
  selected: boolean
  onPress: () => void
}

export function ListRadioItem({ label, selected, onPress }: ListRadioItemProps) {
  return (
    <Pressable
      accessible
      accessibilityRole="radio"
      accessibilityState={{ selected: selected }}
      onPress={onPress}
      onMagicTap={onPress}
      android_ripple={{ color: color.ripple, radius: 10 }}
    >
      <View style={LIST_CONTAINER}>
        <View style={DISC_OUTLINE}>{selected && <View style={DISC_FILL} />}</View>
        <Text style={LIST_TEXT}>{label}</Text>
      </View>
    </Pressable>
  )
}
