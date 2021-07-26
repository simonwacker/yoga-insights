import React, { useReducer, createContext, ReactNode, useContext } from "react"
import { Section, Track } from "../models"

const music = [
  {
    title: "Volume 1",
    data: [
      {
        trackId: "track-music-volume-1-part-3",
        name: "Volume 1 - Teil 3 - Naturklänge zum freien Üben",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%203-Naturkl%C3%A4nge%20zum%20freien%20%C3%9Cben.mp3",
      },
    ],
  },
  {
    title: "Volume 2",
    data: [
      {
        trackId: "track-music-volume-2-part-3",
        name: "Volume 2 - Teil 3 - Musik pur",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%203-Musik%20pur.mp3",
      },
      {
        trackId: "track-music-volume-2-part-6",
        name: "Volume 2 - Teil 6 - Naturklänge",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%206-Naturkl%C3%A4nge.mp3",
      },
    ],
  },
]

type Action = never
type Dispatch = (action: Action) => void
type State = Section<Track>[]
type MusicStoreProviderProps = { children: ReactNode }

const MusicStoreContext = createContext<[State, Dispatch] | undefined>(undefined)

function musicStoreReducer(state: State, _action: Action) {
  return state
}

function MusicStoreProvider({ children }: MusicStoreProviderProps) {
  const value = useReducer(musicStoreReducer, music)
  return <MusicStoreContext.Provider value={value}>{children}</MusicStoreContext.Provider>
}

function useMusicStore() {
  const context = useContext(MusicStoreContext)
  if (context === undefined) {
    throw new Error("`useMusicStore` must be used within a `MusicStoreProvider`")
  }
  return context
}

export { MusicStoreProvider, useMusicStore }
