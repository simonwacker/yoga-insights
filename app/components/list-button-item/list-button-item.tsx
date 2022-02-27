import * as React from "react"
import { List } from "react-native-paper"

export interface ListButtonItemProps {
  label: string
  description: string | null
  onPress: () => void
}

export function ListButtonItem({ description, label, onPress }: ListButtonItemProps) {
  return (
    // TODO Is setting `onMagicTap` necessary?
    <List.Item
      title={label}
      description={description ?? ""}
      onPress={onPress}
      onMagicTap={onPress}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
    />
  )
}
