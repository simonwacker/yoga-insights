import { Track } from "../../models"

export interface AudioPlayerProps {
  track: Track
  backgroundMusic: Track | null
  tracksToDownload: Track[]
  onPlaybackDidJustFinish: () => void
  previousTrack?: Track
  onPlayPreviousTrack: () => void
  nextTrack?: Track
  onPlayNextTrack: () => void
}
