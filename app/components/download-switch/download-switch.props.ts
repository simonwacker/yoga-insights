export interface DownloadSwitchProps {
  trackId: string
  webUri: string
  fileUri: string
  cacheUri: string
  md5HashValue: string
  onDownloadComplete: (uri: string) => Promise<void>
  onDownloadDeleted: (uri: string) => Promise<void>
}
