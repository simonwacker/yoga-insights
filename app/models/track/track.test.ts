import { TrackModel } from "./track"

test("can be created", () => {
  const instance = TrackModel.create({})

  expect(instance).toBeTruthy()
})
