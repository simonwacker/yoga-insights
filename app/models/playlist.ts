export interface Playlist {
  readonly playlistId: number
  readonly name: string
  readonly poseIds: string[]
  readonly musicId: string | null
}
