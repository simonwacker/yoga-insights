import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const TrackModel = types.model("Track").props({
  trackId: types.refinement(types.identifier, (identifier) => identifier.indexOf("track-") === 0),
  name: types.string,
  fileExtension: types.string,
  md5FileHashValue: types.string,
  webUri: types.string,
})

type TrackType = Instance<typeof TrackModel>
export interface Track extends TrackType {}
type TrackSnapshotType = SnapshotOut<typeof TrackModel>
export interface TrackSnapshot extends TrackSnapshotType {}
export const createTrackDefaultModel = () => types.optional(TrackModel, {})
