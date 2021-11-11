import * as React from "react"
import { ReactNode } from "react"
import { AccessibilityRole, View } from "react-native"
import { List } from "react-native-paper"

type Section<ItemT> = { title: string; data: ItemT[] }

export interface SectionListProps<ItemT> {
  sections: Section<ItemT>[]
  renderItem: (value: { item: ItemT; index: number; section: Section<ItemT> }) => ReactNode
  accessibilityRole?: AccessibilityRole
}

export function SectionList<ItemT>({
  sections,
  renderItem,
  accessibilityRole,
}: SectionListProps<ItemT>) {
  return (
    <View accessibilityRole={accessibilityRole}>
      {sections.map((section, index) => (
        <List.Section key={index}>
          <List.Subheader onPressIn={() => {}} onPressOut={() => {}}>
            {section.title}
          </List.Subheader>
          {section.data.map((item, index) => (
            <View key={index}>{renderItem({ item, index, section })}</View>
          ))}
        </List.Section>
      ))}
    </View>
  )
}
