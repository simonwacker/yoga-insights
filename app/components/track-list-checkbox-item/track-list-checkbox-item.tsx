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

export interface TrackListCheckboxItemProps {
  label: string
  checked: boolean
  onPress: () => void
}

export function TrackListCheckboxItem({ label, checked, onPress }: TrackListCheckboxItemProps) {
  return (
    <Pressable
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: checked }}
      onPress={onPress}
    >
      <View style={LIST_CONTAINER}>
        <Text style={LIST_TEXT}>{label}</Text>
      </View>
    </Pressable>
  )
}
