import * as React from "react"
import { Section } from "../../models"
import { useTrackStore } from "../../stores"
import { useCallback } from "react"
import { ListButtonItem } from "../list-button-item/list-button-item"
import { SectionList } from "../section-list/section-list"

export interface TrackSectionListProps {
  sections: Section[]
  onSelectTrack: (initialTrackIndex: number, section: Section) => void
}

export function TrackSectionList({ sections, onSelectTrack }: TrackSectionListProps) {
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))

  return (
    <SectionList
      sections={sections}
      renderItem={({ item, index, section }) => {
        const track = getTrack(item)
        return (
          <ListButtonItem
            key={index}
            label={track.name}
            description={track.description}
            onPress={() => onSelectTrack(index, section as Section)}
          />
        )
      }}
    />
  )
}
