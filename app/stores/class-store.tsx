import React, { useReducer, createContext, ReactNode, useContext } from "react"
import { Section, Track } from "../models"

const classes = [
  {
    title: "Volume 1",
    data: [
      {
        trackId: "track-class-volume-1-part-1",
        name: "Volume 1 - Teil 1 - Grundlegende Einführung",
        fileExtension: "mp3",
        md5FileHashValue: "4154d609e7307a3cc31c9ac1e20ea9d0",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
      },
      {
        trackId: "track-class-volume-1-part-2",
        name: "Volume 1 - Teil 2 - Regeneratives entlastendes Abendprogramm",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%202-Regeneratives%20entlastendes%20Abendprogramm.mp3",
      },
      {
        trackId: "track-class-volume-1-part-4",
        name: "Volume 1 - Teil 4 - Langes Yogaprogramm Rückenstärkung und Rückenentlastung",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%204-Langes%20Yogaprogramm%20R%C3%BCckenst%C3%A4rkung%20und%20R%C3%BCckenentlastung.mp3",
      },
    ],
  },
  {
    title: "Volume 2",
    data: [
      {
        trackId: "track-class-volume-2-part-1",
        name: "Volume 2 - Teil 1 - Einführung",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%201-Einf%C3%BChrung.mp3",
      },
      {
        trackId: "track-class-volume-2-part-2",
        name: "Volume 2 - Teil 2 - Soforthilfe 1 & 2",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%202-Soforthilfe%201%262.mp3",
      },
      {
        trackId: "track-class-volume-2-part-4",
        name: "Volume 2 - Teil 4 - Anleitung ohne Musik",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%204-Anleitung%20ohne%20Musik.mp3",
      },
      {
        trackId: "track-class-volume-2-part-5",
        name: "Volume 2 - Teil 5 - Ausführliches Übungsprogramm",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%205-Ausf%C3%BChrliches%20%C3%9Cbungsprogramm.mp3",
      },
    ],
  },
]

type Action = never
type Dispatch = (action: Action) => void
type State = Section<Track>[]
type ClassStoreProviderProps = { children: ReactNode }

const ClassStoreContext = createContext<[State, Dispatch] | undefined>(undefined)

function classStoreReducer(state: State, _action: Action) {
  return state
}

function ClassStoreProvider({ children }: ClassStoreProviderProps) {
  const value = useReducer(classStoreReducer, classes)
  return <ClassStoreContext.Provider value={value}>{children}</ClassStoreContext.Provider>
}

function useClassStore() {
  const context = useContext(ClassStoreContext)
  if (context === undefined) {
    throw new Error("`useClassStore` must be used within a `ClassStoreProvider`")
  }
  return context
}

export { ClassStoreProvider, useClassStore }
