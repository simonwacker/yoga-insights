import { Playlist } from "../models"
import create from "zustand"
import { persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Immutable, produce } from "immer" // https://github.com/pmndrs/zustand#sick-of-reducers-and-changing-nested-state-use-immer

type State = Immutable<{
  playlists: Playlist[]
  nextPlaylistId: number
  addPlaylist: (playlist: { name: string; poseIds: string[]; musicId: string | null }) => void
  renamePlaylist: (playlistId: number, name: string) => void
  deletePlaylist: (playlistId: number) => void
  clearPlaylists: () => void
}>

export const usePlaylistStore = create<State>(
  persist(
    (set, _get) => ({
      playlists: [],
      nextPlaylistId: 0,
      addPlaylist: (playlist) =>
        set(
          produce<State>((state) => {
            state.playlists.push({ playlistId: state.nextPlaylistId, ...playlist })
            state.nextPlaylistId += 1
          }),
        ),
      renamePlaylist: (playlistId, name) =>
        set(
          produce<State>((state) => {
            var playlist = state.playlists.find((playlist) => playlist.playlistId === playlistId)
            if (playlist === undefined) {
              throw new Error(`Unknown playlist ID ${playlistId}.`)
            }
            playlist.name = name
          }),
        ),
      deletePlaylist: (playlistId) =>
        set(
          produce<State>((state) => {
            state.playlists = state.playlists.filter(
              (playlist) => playlist.playlistId !== playlistId,
            )
          }),
        ),
      clearPlaylists: () => set({ playlists: [] }),
    }),
    {
      name: "playlistStore",
      getStorage: () => AsyncStorage,
    },
  ),
)
