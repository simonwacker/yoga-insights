import * as React from "react"
import { TextStyle } from "react-native"
import { Button } from "react-native-paper"

const CONTENT: TextStyle = {
  justifyContent: "flex-start",
}

export interface ListButtonItemProps {
  label: string
  onPress: () => void
}

export function ListButtonItem({ label, onPress }: ListButtonItemProps) {
  return (
    // TODO Is setting `onMagicTap` necessary?
    <Button
      mode="text"
      uppercase={false}
      contentStyle={CONTENT}
      onPress={onPress}
      onMagicTap={onPress}
    >
      {label}
    </Button>
  )
}
