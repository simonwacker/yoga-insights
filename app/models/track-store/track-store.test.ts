import { TrackStoreModel } from "./track-store"

test("can be created", () => {
  const instance = TrackStoreModel.create({})

  expect(instance).toBeTruthy()
})
