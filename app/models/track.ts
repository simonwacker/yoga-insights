export enum TrackKind {
  Class = "CLASS",
  Pose = "POSE",
  Music = "Music",
}

// TODO Restrict extension and URL type!
export interface Track {
  trackId: string
  kind: TrackKind
  name: string
  fileExtension: string
  md5FileHashValue: string
  webUri: string
  description: string | null
  hints: { name: string; duration: number }[]
}
