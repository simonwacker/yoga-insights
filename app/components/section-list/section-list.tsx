import * as React from "react"
import {
  SectionList as ReactNativeSectionList,
  SectionListData,
  SectionListProps as ReactNativeSectionListProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"
import { spacing } from "../../theme"
import { Text } from "../text/text"

const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const SECTION_TITLE: TextStyle = {
  marginLeft: 10,
}

export interface SectionListProps<ItemT> extends ReactNativeSectionListProps<ItemT> {
  getSectionTitle: (section: SectionListData<ItemT>) => string
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export function SectionList<SectionT>({
  getSectionTitle,
  style,
  ...rest
}: SectionListProps<SectionT>) {
  return (
    <ReactNativeSectionList
      {...rest}
      style={style}
      contentContainerStyle={SECTION_LIST}
      renderSectionHeader={({ section }) => (
        <Text style={SECTION_TITLE}>{getSectionTitle(section)}</Text>
      )}
    />
  )
}
