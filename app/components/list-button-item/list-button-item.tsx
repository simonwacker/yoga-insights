import * as React from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { spacing } from "../../theme"
import { Text } from "../text/text"
import { color } from "../../theme"

const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: spacing.small,
}
const LIST_TEXT: TextStyle = {}

export interface ListButtonItemProps {
  label: string
  onPress: () => void
}

export function ListButtonItem({ label, onPress }: ListButtonItemProps) {
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      onPress={onPress}
      onMagicTap={onPress}
      android_ripple={{ color: color.ripple, radius: 10 }}
    >
      <View style={LIST_CONTAINER}>
        <Text style={LIST_TEXT}>{label}</Text>
      </View>
    </Pressable>
  )
}
