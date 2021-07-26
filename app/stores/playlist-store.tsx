import React, { useReducer, createContext, ReactNode, useContext } from "react"
import { Playlist } from "../models"

type Action = { type: "addPlaylist"; playlist: Playlist }
type Dispatch = (action: Action) => void
type State = Playlist[]
type PlaylistStoreProviderProps = { value: State; children: ReactNode }

const PlaylistsContext = createContext<{ playlists: State; dispatch: Dispatch } | undefined>(
  undefined,
)

function playlistStoreReducer(state: State, action: Action) {
  switch (action.type) {
    case "addPlaylist": {
      return [...state, action.playlist]
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function PlaylistStoreProvider({ value, children }: PlaylistStoreProviderProps) {
  const [state, dispatch] = useReducer(playlistStoreReducer, value)
  return (
    <PlaylistsContext.Provider value={{ playlists: state, dispatch: dispatch }}>
      {children}
    </PlaylistsContext.Provider>
  )
}

function usePlaylistStore() {
  const context = useContext(PlaylistsContext)
  if (context === undefined) {
    throw new Error("`usePlaylists` must be used within a `PlaylistsProvider`")
  }
  return context
}

export { PlaylistStoreProvider, usePlaylistStore }
