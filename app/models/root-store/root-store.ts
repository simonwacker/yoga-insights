import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PlaylistStoreModel } from "../playlist-store/playlist-store"
import { TrackStoreModel } from "../track-store/track-store"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types.model("RootStore").props({
  playlistStore: types.optional(PlaylistStoreModel, {} as any),
  trackStore: types.optional(TrackStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
