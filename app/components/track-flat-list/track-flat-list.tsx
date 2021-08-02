import * as React from "react"
import { FlatList, StyleProp, View, ViewStyle } from "react-native"
import { spacing } from "../../theme"
import { flatten } from "ramda"
import { useTrackStore } from "../../stores"
import { useCallback } from "react"
import { TrackListButtonItem } from "../track-list-button-item/track-list-button-item"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}
const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

export interface TrackListProps {
  trackIds: string[]
  onSelectTrack: (initialTrackIndex: number, trackIds: readonly string[]) => void
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export function TrackFlatList({ trackIds, onSelectTrack, style }: TrackListProps) {
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))

  return (
    <View style={flatten([CONTAINER, style])}>
      <FlatList
        contentContainerStyle={FLAT_LIST}
        data={trackIds}
        keyExtractor={(item) => item}
        renderItem={({ item, index }) => (
          <TrackListButtonItem
            label={getTrack(item).name}
            onPress={() => onSelectTrack(index, trackIds)}
          />
        )}
      />
    </View>
  )
}
