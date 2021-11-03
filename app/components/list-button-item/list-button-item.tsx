import * as React from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { spacing } from "../../theme"
import { Text } from "../text/text"

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
    <Pressable accessible accessibilityRole="button" onPress={onPress} onMagicTap={onPress}>
      <View style={LIST_CONTAINER}>
        <Text style={LIST_TEXT}>{label}</Text>
      </View>
    </Pressable>
  )
}
