import { MaterialCommunityIcons } from "@expo/vector-icons"
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types"
import * as React from "react"
import { Appbar } from "react-native-paper"

export interface CancelActionProps {
  onPress: () => void
  props: HeaderButtonProps
}

export function CancelAction({ onPress, props }: CancelActionProps) {
  return (
    <Appbar.Action
      {...props}
      accessibilityLabel="Abbrechen"
      accessibilityRole="button"
      accessible={true}
      icon={(props) => <MaterialCommunityIcons name="close" {...props} />}
      onPress={onPress}
      onMagicTap={onPress}
    />
  )
}
