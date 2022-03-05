export interface Playlist {
  readonly playlistId: number
  readonly name: string
  readonly poseIds: readonly string[]
  readonly musicId: string | null
}
