import { TrackSectionModel } from "./track-section"

test("can be created", () => {
  const instance = TrackSectionModel.create({})

  expect(instance).toBeTruthy()
})
