import * as FileSystem from "expo-file-system"
import { Track } from "../models"

export const tracksDirectoryUri = `${FileSystem.documentDirectory}tracks/`

export function getTrackFileUri(track: Track) {
  return `${tracksDirectoryUri}${track.trackId}.${track.fileExtension}`
}
