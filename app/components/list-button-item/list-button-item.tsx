import * as React from "react"
import { List } from "react-native-paper"

export interface ListButtonItemProps {
  label: string
  onPress: () => void
}

export function ListButtonItem({ label, onPress }: ListButtonItemProps) {
  return (
    // TODO Is setting `onMagicTap` necessary?
    <List.Item
      title={label}
      onPress={onPress}
      onMagicTap={onPress}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
    />
  )
}
