import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { Section } from "../../models"
import { useTrackStore } from "../../stores"
import { useCallback } from "react"
import { ListButtonItem } from "../list-button-item/list-button-item"
import { SectionList } from "../section-list/section-list"

export interface TrackSectionListProps {
  sections: Section[]
  onSelectTrack: (initialTrackIndex: number, trackIds: readonly string[]) => void
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export function TrackSectionList({ sections, onSelectTrack, style }: TrackSectionListProps) {
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))

  return (
    <SectionList
      sections={sections}
      renderItem={({ item, index, section }) => (
        <ListButtonItem
          label={getTrack(item).name}
          onPress={() => onSelectTrack(index, section.data)}
        />
      )}
    />
  )
}
