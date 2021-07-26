import React, { ReactNode } from "react"
import { Playlist } from "../models"
import * as storage from "../utils/storage"
import { ClassStoreProvider } from "./class-store"
import { PoseStoreProvider } from "./pose-store"
import { MusicStoreProvider } from "./music-store"
import { PlaylistStoreProvider } from "./playlist-store"

const PLAYLIST_STORE_STATE_STORAGE_KEY = "playlist"

export type RootStore = {
  playlists: Playlist[]
}

type RootStoreProviderProps = { value: RootStore; children: ReactNode }

export function RootStoreProvider({ value, children }: RootStoreProviderProps) {
  return (
    <ClassStoreProvider>
      <PoseStoreProvider>
        <MusicStoreProvider>
          <PlaylistStoreProvider value={value.playlists}>{children}</PlaylistStoreProvider>
        </MusicStoreProvider>
      </PoseStoreProvider>
    </ClassStoreProvider>
  )
}

export async function setupRootStore() {
  try {
    return {
      playlists: (await storage.load(PLAYLIST_STORE_STATE_STORAGE_KEY)) || [],
    }
  } catch (error) {
    __DEV__ && console.error(error)
    return { playlists: [] }
  }
}
