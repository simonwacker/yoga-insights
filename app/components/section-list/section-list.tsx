import * as React from "react"
import { ReactElement } from "react"
import { AccessibilityRole, SectionListData, View } from "react-native"
import { List } from "react-native-paper"

type Section<ItemT> = { title: string; data: ItemT[] }

export interface SectionListProps<ItemT> {
  sections: Section<ItemT>[]
  renderItem: (info: {
    item: ItemT
    index: number
    section: SectionListData<ItemT>
  }) => ReactElement
  accessibilityRole?: AccessibilityRole
}

export function SectionList<ItemT>({
  sections,
  renderItem,
  accessibilityRole,
}: SectionListProps<ItemT>) {
  return (
    // <ReactNativeSectionList<ItemT>
    //   accessibilityRole={accessibilityRole}
    //   sections={sections}
    //   renderItem={renderItem}
    //   renderSectionHeader={({ section }) => (
    //     <List.Subheader onPressIn={() => {}} onPressOut={() => {}}>
    //       {/* accessing title like this is unsafe */}
    //       {section.title}
    //     </List.Subheader>
    //   )}
    // />
    <View accessibilityRole={accessibilityRole}>
      {sections.map((section, index) => (
        <List.Section key={index}>
          <List.Subheader onPressIn={() => {}} onPressOut={() => {}}>
            {section.title}
          </List.Subheader>
          {section.data.map((item, index) => renderItem({ item, index, section }))}
        </List.Section>
      ))}
    </View>
  )
}
