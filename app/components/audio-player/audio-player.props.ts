export interface AudioPlayerProps {
  trackId: string
  name: string
  fileExtension: string
  md5FileHashValue: string
  webUri: string
  onPlaybackDidJustFinish: () => void
}
