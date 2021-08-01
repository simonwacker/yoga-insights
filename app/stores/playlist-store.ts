import { Playlist } from "../models"
import create from "zustand"
import { persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import produce from "immer" // https://github.com/pmndrs/zustand#sick-of-reducers-and-changing-nested-state-use-immer

type State = {
  playlists: Playlist[]
  nextPlaylistId: number
  addPlaylist: (playlist: { name: string; trackIds: string[] }) => void
  renamePlaylist: (playlistId: number, name: string) => void
  removePlaylist: (playlistId: number) => void
  clearPlaylists: () => void
}

export const usePlaylistStore = create<State>(
  persist(
    (set, _get) => ({
      playlists: [],
      nextPlaylistId: 0,
      addPlaylist: (playlist) =>
        set(
          produce((state) => {
            state.playlists.push({ playlistId: state.nextPlaylistId, ...playlist })
            state.nextPlaylistId += 1
          }),
        ),
      renamePlaylist: (playlistId, name) =>
        set(
          produce((state) => {
            state.playlists.find((playlist) => playlist.playlistId === playlistId).name = name
          }),
        ),
      removePlaylist: (playlistId) =>
        set(
          produce((state) => {
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
