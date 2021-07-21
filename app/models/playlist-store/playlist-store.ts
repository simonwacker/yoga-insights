import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PlaylistModel, PlaylistSnapshot } from "../playlist/playlist"
import { withEnvironment } from "../extensions/with-environment"

export const PlaylistStoreModel = types
  .model("PlaylistStore")
  .props({
    playlists: types.optional(types.array(PlaylistModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    savePlaylists: (playlistSnapshots: PlaylistSnapshot[]) => {
      self.playlists.replace(playlistSnapshots)
    },
  }))
  .actions((self) => ({
    addPlaylist: (playlist: PlaylistModel) => {
      self.playlists?.push(playlist)
    },
    getPlaylists: async () => {
      self.savePlaylists([])
      // TODO Persist and load persisted playlists somehow. Maybe with https://github.com/quarrant/mobx-persist-store
      // The ignite boilerplate does it with an API as follows:
      // const playlistApi = new PlaylistApi(self.environment.api)
      // const result = await playlistApi.getPlaylists()

      // if (result.kind === "ok") {
      //   self.savePlaylists(result.playlists)
      // } else {
      //   __DEV__ && console.tron.log(result.kind)
      // }
    },
  }))

type PlaylistStoreType = Instance<typeof PlaylistStoreModel>
export interface PlaylistStore extends PlaylistStoreType {}
type PlaylistStoreSnapshotType = SnapshotOut<typeof PlaylistStoreModel>
export interface PlaylistStoreSnapshot extends PlaylistStoreSnapshotType {}
export const createPlaylistStoreDefaultModel = () => types.optional(PlaylistStoreModel, {})
