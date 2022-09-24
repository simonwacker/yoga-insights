import { Playlist } from "../models"
import create from "zustand"
import { persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Immutable, produce } from "immer" // https://github.com/pmndrs/zustand#sick-of-reducers-and-changing-nested-state-use-immer

type State = Immutable<{
  playlists: Playlist[]
  nextPlaylistId: number
  getPlaylist: (playlistId: number) => Playlist
  addPlaylist: (playlist: { name: string; poseIds: string[]; musicId: string | null }) => void
  updatePlaylist: (
    playlistId: number,
    newPlaylist: { name: string; poseIds: string[]; musicId: string | null },
  ) => void
  deletePlaylist: (playlistId: number) => void
  clearPlaylists: () => void
}>

export const usePlaylistStore = create<State>()(
  persist(
    (set, get) => ({
      playlists: [],
      nextPlaylistId: 0,
      getPlaylist: (playlistId) => {
        const playlist = get().playlists.find((playlist) => playlist.playlistId === playlistId)
        if (playlist === undefined) {
          throw new Error(`Unknown playlist ID ${playlistId}.`)
        }
        return playlist
      },
      addPlaylist: (playlist) =>
        set(
          produce<State>((state) => {
            state.playlists.push({ playlistId: state.nextPlaylistId, ...playlist })
            state.nextPlaylistId += 1
          }),
        ),
      updatePlaylist: (playlistId, newPlaylist) =>
        set(
          produce<State>((state) => {
            const playlist = state.playlists.find((playlist) => playlist.playlistId === playlistId)
            if (playlist === undefined) {
              throw new Error(`Unknown playlist ID ${playlistId}.`)
            }
            playlist.name = newPlaylist.name
            playlist.poseIds = newPlaylist.poseIds
            playlist.musicId = newPlaylist.musicId
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
