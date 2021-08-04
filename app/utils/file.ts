import { FileSystem } from "react-native-unimodules"
import { Track } from "../models"

export const tracksDirectoryUri = `${FileSystem.documentDirectory}tracks/`

export function getTrackFileUri(track: Track) {
  return `${tracksDirectoryUri}${track.trackId}.${track.fileExtension}`
}
