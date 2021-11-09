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
const BOX_DIMENSIONS = { width: 16, height: 16 }
const BOX_OUTLINE: ViewStyle = {
  ...BOX_DIMENSIONS,
  marginTop: 2, // finicky and will depend on font/line-height/baseline/weather
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: color.primaryDarker,
  borderRadius: 1,
}
const BOX_FILL: ViewStyle = {
  width: BOX_DIMENSIONS.width - 4,
  height: BOX_DIMENSIONS.height - 4,
  backgroundColor: color.primary,
}
const LIST_TEXT: TextStyle = {
  marginLeft: spacing.small,
}

export interface ListCheckboxItemProps {
  label: string
  checked: boolean
  onPress: () => void
}

export function ListCheckboxItem({ label, checked, onPress }: ListCheckboxItemProps) {
  return (
    <Pressable
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: checked }}
      onPress={onPress}
      onMagicTap={onPress}
      android_ripple={{ color: color.ripple, radius: 10 }}
    >
      <View style={LIST_CONTAINER}>
        <View style={BOX_OUTLINE}>{checked && <View style={BOX_FILL} />}</View>
        <Text style={LIST_TEXT}>{label}</Text>
      </View>
    </Pressable>
  )
}
