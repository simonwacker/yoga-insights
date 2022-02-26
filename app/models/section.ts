import { TrackKind } from "./track"

export enum SectionKind {
  General = "GENERAL",
  Playlist = "PLAYLIST",
}

export interface Section {
  title: string
  kind: SectionKind
  trackKind: TrackKind
  data: string[]
}
