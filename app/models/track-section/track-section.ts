import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { TrackModel } from "../track/track"

export const TrackSectionModel = types.model("TrackSection").props({
  title: types.string,
  data: types.array(TrackModel),
})

type TrackSectionType = Instance<typeof TrackSectionModel>
export interface TrackSection extends TrackSectionType {}
type TrackSectionSnapshotType = SnapshotOut<typeof TrackSectionModel>
export interface TrackSectionSnapshot extends TrackSectionSnapshotType {}
export const createTrackSectionDefaultModel = () => types.optional(TrackSectionModel, {})
