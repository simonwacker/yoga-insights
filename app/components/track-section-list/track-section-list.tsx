import * as React from "react"
import { SectionList, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { spacing } from "../../theme"
import { Text } from "../text/text"
import { flatten } from "ramda"
import { Section } from "../../models"
import { useTrackStore } from "../../stores"
import { useCallback } from "react"
import { TrackListButtonItem } from "../track-list-button-item/track-list-button-item"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}
const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const SECTION_TITLE: TextStyle = {
  marginLeft: 10,
}

export interface TrackListProps {
  sections: Section[]
  onSelectTrack: (initialTrackIndex: number, trackIds: readonly string[]) => void
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export function TrackSectionList({ sections, onSelectTrack, style }: TrackListProps) {
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))

  return (
    <View style={flatten([CONTAINER, style])}>
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={sections}
        keyExtractor={(item) => item}
        renderSectionHeader={({ section }) => <Text style={SECTION_TITLE}>{section.title}</Text>}
        renderItem={({ item, index, section }) => (
          <TrackListButtonItem
            label={getTrack(item).name}
            onPress={() => onSelectTrack(index, section.data)}
          />
        )}
      />
    </View>
  )
}
