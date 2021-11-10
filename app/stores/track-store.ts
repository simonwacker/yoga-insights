import create from "zustand"
import { Section, Track } from "../models"

const tracks = [
  {
    trackId: "track-volume-1-part-1",
    name: "Grundlegende Einführung",
    fileExtension: "mp3",
    md5FileHashValue: "4154d609e7307a3cc31c9ac1e20ea9d0",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
  },
  {
    trackId: "track-volume-1-part-2",
    name: "Regeneratives entlastendes Abendprogramm",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%202-Regeneratives%20entlastendes%20Abendprogramm.mp3",
  },
  {
    trackId: "track-volume-1-part-3",
    name: "Naturklänge zum freien Üben",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%203-Naturkl%C3%A4nge%20zum%20freien%20%C3%9Cben.mp3",
  },
  {
    trackId: "track-volume-1-part-4",
    name: "Langes Yogaprogramm Rückenstärkung und Rückenentlastung",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%204-Langes%20Yogaprogramm%20R%C3%BCckenst%C3%A4rkung%20und%20R%C3%BCckenentlastung.mp3",
  },
  {
    trackId: "track-volume-2-part-1",
    name: "Einführung",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%201-Einf%C3%BChrung.mp3",
  },
  {
    trackId: "track-volume-2-part-2",
    name: "Soforthilfe 1 & 2",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%202-Soforthilfe%201%262.mp3",
  },
  {
    trackId: "track-volume-2-part-3",
    name: "Musik pur",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%203-Musik%20pur.mp3",
  },
  {
    trackId: "track-volume-2-part-4",
    name: "Anleitung ohne Musik",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%204-Anleitung%20ohne%20Musik.mp3",
  },
  {
    trackId: "track-volume-2-part-5",
    name: "Ausführliches Übungsprogramm",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%205-Ausf%C3%BChrliches%20%C3%9Cbungsprogramm.mp3",
  },
  {
    trackId: "track-volume-2-part-6",
    name: "Naturklänge",
    fileExtension: "mp3",
    md5FileHashValue: "?",
    webUri:
      "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%206-Naturkl%C3%A4nge.mp3",
  },
]

const indexedTracks = tracks.reduce((map, track) => {
  map.set(track.trackId, track)
  return map
}, new Map<string, Track>())

const classSections = [
  {
    title: "Volume 1",
    data: ["track-volume-1-part-1", "track-volume-1-part-2", "track-volume-1-part-4"],
  },
  {
    title: "Volume 2",
    data: [
      "track-volume-2-part-1",
      "track-volume-2-part-2",
      "track-volume-2-part-4",
      "track-volume-2-part-5",
    ],
  },
]

const poseSections = [
  {
    title: "Volume 1",
    data: ["track-volume-1-part-1", "track-volume-1-part-2", "track-volume-1-part-4"],
  },
  {
    title: "Volume 2",
    data: [
      "track-volume-2-part-1",
      "track-volume-2-part-2",
      "track-volume-2-part-4",
      "track-volume-2-part-5",
    ],
  },
]

const musicSections = [
  {
    title: "Volume 1",
    data: ["track-volume-1-part-3"],
  },
  {
    title: "Volume 2",
    data: ["track-volume-2-part-3", "track-volume-2-part-6"],
  },
]

const fallbackTrack = {
  trackId: "track-volume-1-part-1",
  name: "Grundlegende Einführung",
  fileExtension: "mp3",
  md5FileHashValue: "4154d609e7307a3cc31c9ac1e20ea9d0",
  webUri:
    "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
}

type State = {
  getTrack: (trackId: string) => Track
  classSections: Section[]
  poseSections: Section[]
  musicSections: Section[]
}

export const useTrackStore = create<State>((_set, _get) => ({
  getTrack: (trackId: string) => {
    const track = indexedTracks.get(trackId)
    if (track !== undefined) {
      return track
    } else {
      console.error(`Unknown track ID ${trackId}`)
      return fallbackTrack
    }
  },
  classSections: classSections,
  poseSections: poseSections,
  musicSections: musicSections,
}))
