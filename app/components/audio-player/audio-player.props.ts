import { Track } from "../../models"

export interface AudioPlayerProps {
  track: Track
  backgroundMusic: Track | null
  onPlaybackDidJustFinish: () => void
  previousTrack?: Track
  onPlayPreviousTrack: () => void
  nextTrack?: Track
  onPlayNextTrack: () => void
}
