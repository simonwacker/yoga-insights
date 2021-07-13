export interface DownloadSwitchProps {
  trackId: string
  sourceWebUri: string
  targetFileUri: string
  md5FileHashValue: string
  onDownloadComplete: (targetFileUri: string) => Promise<void>
  onDownloadJustAboutToBeDeleted: (sourceWebUri: string) => Promise<void>
}
