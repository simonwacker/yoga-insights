import { DownloadResumable, FileSystemDownloadResult } from "expo-file-system"
import * as FileSystem from "expo-file-system"
import { Track } from "../models"
import { getTrackFileUri } from "../utils/file"
import { assertNotUndefined } from "../utils/types"

/** Represents the initial state where we're unsure whether the track has been
 * downloaded yet or not. We first have to look at the local file system which
 * is an async operation.
 */
type DownloadStateUnknown = { type: "UNKNOWN" }
/** Represents a downloaded track including the local file path (`uri`) and the
 * expected `md5` value.
 */
type DownloadStateDownloaded = {
  type: "DOWNLOADED"
  uri: string
  md5: string
}
/** Represents a track which is currently being downloaded.
 */
type DownloadStateDownloading = {
  type: "DOWNLOADING"
  progress: number
  downloadResumable: DownloadResumable
}
/** Represents a failed download attempt.
 */
type DownloadStateFailed = { type: "FAILED_DOWNLOADING"; error: string }
/** Represents a track which hasn't been downloaded yet.
 */
type DownloadStateNotDownloaded = { type: "NOT_DOWNLOADED" }

export type DownloadState =
  | DownloadStateUnknown
  | DownloadStateDownloaded
  | DownloadStateDownloading
  | DownloadStateFailed
  | DownloadStateNotDownloaded

export class TrackDownloadsClient {
  private cachedDownloadState: Map<string, DownloadState>
  private listeners: Map<string, (() => void)[]>

  constructor() {
    this.cachedDownloadState = new Map()
    this.listeners = new Map()
  }

  setCachedDownloadStateFromStateInLocalFileSystemIfItIsUnknown(track: Track) {
    const entry = this.fetchDownloadState(track.trackId)

    if (entry.type !== "UNKNOWN") {
      return
    }

    FileSystem.getInfoAsync(getTrackFileUri(track), { md5: true }).then(
      (fileInfo) => {
        if (fileInfo.exists) {
          this.cachedDownloadState.set(track.trackId, {
            type: "DOWNLOADED",
            uri: fileInfo.uri,
            md5: fileInfo.md5!,
          })
          this.notify(track.trackId)
        } else {
          this.cachedDownloadState.set(track.trackId, {
            type: "NOT_DOWNLOADED",
          })
          this.notify(track.trackId)
        }
      },
      (error) => {
        console.error(`Failed to determine download status of track ${track.trackId}.`, error)
      },
    )
  }

  fetchDownloadState(trackId: string): DownloadState {
    const downloadState = this.cachedDownloadState.get(trackId)

    if (downloadState === undefined) {
      return { type: "UNKNOWN" }
    } else {
      return downloadState
    }
  }

  startDownload(track: Track): void {
    const currentState = this.fetchDownloadState(track.trackId)

    if (currentState.type === "NOT_DOWNLOADED" || currentState.type === "FAILED_DOWNLOADING") {
      const callback = ({
        totalBytesWritten,
        totalBytesExpectedToWrite,
      }: {
        totalBytesWritten: number
        totalBytesExpectedToWrite: number
      }) => {
        const state = this.fetchDownloadState(track.trackId)
        if (state.type === "DOWNLOADING") {
          state.progress = totalBytesWritten / totalBytesExpectedToWrite
        }
        this.notify(track.trackId)
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        track.webUri,
        getTemporaryFileUri(track),
        // NOTE: Make sure to account for FileSystemDownloadResult.md5 not
        // existing if you change this to `false` or remove it.
        { md5: true },
        callback,
      )
      downloadResumable.downloadAsync().then(
        (r) => {
          this.handleDownloaded(track, r)
        },
        (e) => {
          this.handleDownloadFailed(track.trackId, e)
        },
      )
      this.cachedDownloadState.set(track.trackId, {
        type: "DOWNLOADING",
        progress: 0,
        downloadResumable,
      })
      this.notify(track.trackId)
    }
  }

  clearDownload(track: Track): void {
    const currentState = this.fetchDownloadState(track.trackId)

    if (currentState.type === "DOWNLOADING") {
      currentState.downloadResumable.cancelAsync().then(
        () => {},
        (error) => {
          console.error(`Failed to cancel download of track ${track.trackId}`, error)
        },
      )
    }

    FileSystem.deleteAsync(
      currentState.type === "DOWNLOADING" || currentState.type === "FAILED_DOWNLOADING"
        ? getTemporaryFileUri(track)
        : getTrackFileUri(track),
    ).then(
      () => {
        this.cachedDownloadState.set(track.trackId, {
          type: "NOT_DOWNLOADED",
        })
        this.notify(track.trackId)
      },
      (error) => {
        console.error(
          `Failed to delete temporary or persistent file of track ${track.trackId}`,
          error,
        )
      },
    )
  }

  subscribe(trackId: string, callback: () => void): () => void {
    const entry = this.listeners.get(trackId)

    if (entry) {
      entry.push(callback)
    } else {
      this.listeners.set(trackId, [callback])
    }

    const unsubscribe = () => {
      const entries = this.listeners.get(trackId) ?? []

      this.listeners.set(
        trackId,
        entries.filter((e) => e !== callback),
      )
    }

    return unsubscribe
  }

  protected notify(trackId: string) {
    const entries = this.listeners.get(trackId) ?? []

    entries.forEach((callback) => callback())
  }

  private async handleDownloaded(
    track: Track,
    result: FileSystemDownloadResult | null | undefined,
  ): Promise<void> {
    // NOTE: The resolved promise equals null on iOS if the download has
    // been paused despite the type signature of `downloadAsync` only allowing
    // for `undefined`.
    if (result === undefined || result === null) {
      return
    }
    __DEV__ && console.log("download successful", result)
    const destination = getTrackFileUri(track)
    await FileSystem.moveAsync({ from: result.uri, to: destination })

    // TODO: At this point we drop the DownloadResumable which _should_ also
    // lead to the callback/subscription stuff being collected by the GC. Do we
    // need to clean up manually?
    this.cachedDownloadState.set(track.trackId, {
      type: "DOWNLOADED",
      uri: destination,
      // NOTE: The md5 field always exists since we set the { md5: true }
      // option above, therefore it's safe to assert `md5 !== undefined` here.
      md5: assertNotUndefined(result.md5),
    })

    this.notify(track.trackId)
  }

  private handleDownloadFailed(trackId: string, error: Error): void {
    __DEV__ && console.log("download failed", error)
    this.cachedDownloadState.set(trackId, {
      type: "FAILED_DOWNLOADING",
      error: error.toString(),
    })

    this.notify(trackId)
  }
}

function getTemporaryFileUri(track: Track) {
  return `${FileSystem.cacheDirectory}${track.trackId}.${track.fileExtension}`
}
