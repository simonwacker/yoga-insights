import { PlaylistStoreModel } from "./playlist-store"

test("can be created", () => {
  const instance = PlaylistStoreModel.create({})

  expect(instance).toBeTruthy()
})
