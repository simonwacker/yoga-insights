import * as React from "react"
import { Checkbox } from "react-native-paper"

export interface ListCheckboxItemProps {
  label: string
  checked: boolean
  onPress: () => void
}

export function ListCheckboxItem({ label, checked, onPress }: ListCheckboxItemProps) {
  return (
    <Checkbox.Item label={label} status={checked ? "checked" : "unchecked"} onPress={onPress} />
  )
}
