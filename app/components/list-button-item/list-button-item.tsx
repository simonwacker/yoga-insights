import * as React from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { color, typography } from "../../theme"
import { Text } from "../text/text"

const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: 10,
}
const LIST_TEXT: TextStyle = {
  marginLeft: 10,
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface ListButtonItemProps {
  label: string
  onPress: () => void
}

export function ListButtonItem({ label, onPress }: ListButtonItemProps) {
  return (
    <Pressable accessible accessibilityRole="button" onPress={onPress}>
      <View style={LIST_CONTAINER}>
        <Text style={LIST_TEXT}>{label}</Text>
      </View>
    </Pressable>
  )
}
