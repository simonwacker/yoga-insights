import * as React from "react"
import {
  FlatList as ReactNativeFlatList,
  FlatListProps as ReactNativeFlatListProps,
  StyleProp,
  ViewStyle,
} from "react-native"
import { spacing } from "../../theme"

const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

export interface FlatListProps<ItemT> extends ReactNativeFlatListProps<ItemT> {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export function FlatList<ItemT>({ style, ...rest }: FlatListProps<ItemT>) {
  return <ReactNativeFlatList {...rest} style={style} contentContainerStyle={FLAT_LIST} />
}
