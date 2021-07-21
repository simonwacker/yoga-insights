import { PlaylistModel } from "./playlist"

test("can be created", () => {
  const instance = PlaylistModel.create({
    id: 1,
    name: "Rick Sanchez",
  })

  expect(instance).toBeTruthy()
})
