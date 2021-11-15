import * as React from "react"
import { RadioButton } from "react-native-paper"

export interface ListRadioItemProps {
  label: string
  value: string
  selected: boolean
  onPress: () => void
}

export function ListRadioItem({ label, value, selected, onPress }: ListRadioItemProps) {
  return (
    <RadioButton.Item
      label={label}
      value={value}
      status={selected ? "checked" : "unchecked"}
      onPress={onPress}
    />
  )
}
