import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const PlaylistModel = types.model("Playlist").props({
  name: types.string,
  trackIds: types.array(types.string),
})

type PlaylistType = Instance<typeof PlaylistModel>
export interface Playlist extends PlaylistType {}
type PlaylistSnapshotType = SnapshotOut<typeof PlaylistModel>
export interface PlaylistSnapshot extends PlaylistSnapshotType {}
export const createPlaylistDefaultModel = () => types.optional(PlaylistModel, {})
