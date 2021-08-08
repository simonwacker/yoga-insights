import { Track } from "../../models"

export interface DownloadSwitchProps {
  tracks: Track[]
  onDownloadComplete: (trackId: string, targetFileUri: string) => Promise<void>
  onDownloadJustAboutToBeDeleted: (trackId: string, sourceWebUri: string) => Promise<void>
}
