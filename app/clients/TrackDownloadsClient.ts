import { DownloadResumable, FileSystemDownloadResult } from "expo-file-system"
import * as FileSystem from "expo-file-system"
import { Track } from "../models"
import { getTrackFileUri } from "../utils/file"
import { assertNotUndefined } from "../utils/types"

export type RequestedDownloadState = "NONE" | "DOWNLOADED" | "NOT_DOWNLOADED"

export enum TransitionAction {
  None = "NONE",
  Start = "START",
  Cancel = "CANCEL",
  Delete = "DELETE",
}

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
/** Represents the process of finalizing a downloading process.
 */
type DownloadStateFinalizing = {
  type: "FINALIZING"
  progress: 1
  downloadResumable: DownloadResumable
}
/** Represents the process of cancelling an active downloading process.
 */
type DownloadStateCancelling = { type: "CANCELLING"; progress: number }
/** Represents the process of deleting a downloaded track.
 */
type DownloadStateDeleting = { type: "DELETING" }
/** Represents a track which hasn't been downloaded yet.
 */
type DownloadStateNotDownloaded = { type: "NOT_DOWNLOADED" }

export type DownloadState =
  | DownloadStateUnknown
  | DownloadStateDownloaded
  | DownloadStateDownloading
  | DownloadStateFinalizing
  | DownloadStateCancelling
  | DownloadStateDeleting
  | DownloadStateNotDownloaded

export class TrackDownloadsClient {
  private requestedDownloadStates: Map<string, RequestedDownloadState>
  private cachedDownloadStates: Map<string, DownloadState>
  private listeners: Map<string, (() => void)[]>

  constructor() {
    this.requestedDownloadStates = new Map()
    this.cachedDownloadStates = new Map()
    this.listeners = new Map()
  }

  setCachedDownloadStateFromStateInLocalFileSystemIfItIsUnknown(track: Track) {
    const entry = this.getDownloadState(track.trackId)
    if (entry.type !== "UNKNOWN") {
      return
    }
    FileSystem.getInfoAsync(getTrackFileUri(track), { md5: true }).then(
      (fileInfo) => {
        if (fileInfo.exists) {
          this.cachedDownloadStates.set(track.trackId, {
            type: "DOWNLOADED",
            uri: fileInfo.uri,
            md5: fileInfo.md5!,
          })
          this.notify(track.trackId)
        } else {
          this.cachedDownloadStates.set(track.trackId, {
            type: "NOT_DOWNLOADED",
          })
          this.notify(track.trackId)
        }
      },
      (error) => {
        console.error(`Failed to determine download state of track ${track.trackId}.`, error)
      },
    )
  }

  getRequestedDownloadState(trackId: string): RequestedDownloadState {
    const state = this.requestedDownloadStates.get(trackId)
    if (state === undefined) {
      return "NONE"
    }
    return state
  }

  getDownloadState(trackId: string): DownloadState {
    const state = this.cachedDownloadStates.get(trackId)
    if (state === undefined) {
      return { type: "UNKNOWN" }
    }
    return state
  }

  getStateToRequestNextAndCorrespondingAction(
    trackId: string,
  ): [RequestedDownloadState, TransitionAction] {
    const currentState = this.getDownloadState(trackId)
    switch (currentState.type) {
      case "UNKNOWN":
        return ["NONE", TransitionAction.None]
      case "DOWNLOADED":
        return ["NOT_DOWNLOADED", TransitionAction.Delete]
      case "DOWNLOADING":
      case "FINALIZING":
        return ["NOT_DOWNLOADED", TransitionAction.Cancel]
      case "NOT_DOWNLOADED":
      case "CANCELLING":
      case "DELETING":
        return ["DOWNLOADED", TransitionAction.Start]
    }
  }

  hasFailedToSatisfyRequest(trackId: string): boolean {
    const requestedState = this.getRequestedDownloadState(trackId)
    const currentState = this.getDownloadState(trackId)
    switch (currentState.type) {
      case "UNKNOWN":
        return requestedState !== "NONE"
      case "DOWNLOADED":
        return requestedState === "NOT_DOWNLOADED"
      case "NOT_DOWNLOADED":
        return requestedState === "DOWNLOADED"
      case "DOWNLOADING":
      case "FINALIZING":
      case "CANCELLING":
      case "DELETING":
        return false
    }
  }

  transition(track: Track, requestedState: RequestedDownloadState): void {
    this.requestedDownloadStates.set(track.trackId, requestedState)
    const currentState = this.getDownloadState(track.trackId)
    switch (currentState.type) {
      case "UNKNOWN":
        __DEV__ &&
          console.warn(
            `Requested transition to state ${requestedState} for track ${track.trackId} in unknown state`,
          )
        break
      case "DOWNLOADED":
        if (requestedState === "NOT_DOWNLOADED") {
          this.deleteDownload(track)
        }
        break
      case "NOT_DOWNLOADED":
        if (requestedState === "DOWNLOADED") {
          this.startDownload(track)
        }
        break
      case "DOWNLOADING":
        if (requestedState === "NOT_DOWNLOADED") {
          this.cancelDownload(track)
        }
        break
      case "FINALIZING":
      case "CANCELLING":
      case "DELETING":
        break
    }
    this.notify(track.trackId)
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

  private startDownload(track: Track): void {
    const currentState = this.getDownloadState(track.trackId)
    if (currentState.type === "NOT_DOWNLOADED") {
      __DEV__ && console.log(`Starting download of track ${track.trackId}`)
      var downloadResumable: DownloadResumable | null = null
      const callback = ({
        totalBytesWritten,
        totalBytesExpectedToWrite,
      }: {
        totalBytesWritten: number
        totalBytesExpectedToWrite: number
      }) => {
        const state = this.getDownloadState(track.trackId)
        // The callback is only meant for active downloads and only for the
        // latest download attempt. Because callbacks cannot be unsubscribed
        // from resumable downloads, we check whether this callback was meant
        // for the latest resumable download. At some point the resumable
        // download its callback should be garbage collected but who knows when
        // exactly this happens.
        if (state.type === "DOWNLOADING" && state.downloadResumable === downloadResumable) {
          state.progress = totalBytesWritten / totalBytesExpectedToWrite
          this.notify(track.trackId)
        }
      }
      downloadResumable = FileSystem.createDownloadResumable(
        track.webUri,
        getTemporaryFileUri(track),
        // NOTE: Make sure to account for FileSystemDownloadResult.md5 not
        // existing if you change this to `false` or remove it.
        { md5: true },
        callback,
      )
      downloadResumable.downloadAsync().then(
        (result) => {
          this.handleDownloadComplete(track, result)
        },
        (error) => {
          this.handleDownloadFailed(track, error)
        },
      )
      this.cachedDownloadStates.set(track.trackId, {
        type: "DOWNLOADING",
        progress: 0,
        downloadResumable,
      })
      this.notify(track.trackId)
    } else {
      __DEV__ && console.log(`Already downloaded track ${track.trackId}`)
    }
  }

  private cancelDownload(track: Track): void {
    __DEV__ && console.log(`Cancelling download of track ${track.trackId}`)
    const currentState = this.getDownloadState(track.trackId)
    if (currentState.type === "DOWNLOADING") {
      currentState.downloadResumable.cancelAsync().then(
        () => {
          __DEV__ && console.log(`Deleting temporary file of track ${track.trackId}`)
          const afterDeletionAttempt = () => {
            cleanupDownloadResumable(currentState.downloadResumable)
            this.cachedDownloadStates.set(track.trackId, {
              type: "NOT_DOWNLOADED",
            })
            this.notify(track.trackId)
            this.transition(track, this.getRequestedDownloadState(track.trackId))
          }
          FileSystem.deleteAsync(getTemporaryFileUri(track)).then(afterDeletionAttempt, (error) => {
            console.error(`Failed to delete temporary file of track ${track.trackId}`, error)
            afterDeletionAttempt()
          })
        },
        (error) => {
          console.error(`Failed to cancel download of track ${track.trackId}`, error)
          this.cachedDownloadStates.set(track.trackId, currentState)
          this.notify(track.trackId)
          const requestedState = this.getRequestedDownloadState(track.trackId)
          if (requestedState !== "NOT_DOWNLOADED") {
            this.transition(track, requestedState)
          }
        },
      )
      this.cachedDownloadStates.set(track.trackId, {
        type: "CANCELLING",
        progress: currentState.progress,
      })
      this.notify(track.trackId)
    }
  }

  private deleteDownload(track: Track): void {
    __DEV__ && console.log(`Deleting track ${track.trackId}`)
    const currentState = this.getDownloadState(track.trackId)
    if (currentState.type === "DOWNLOADED") {
      FileSystem.deleteAsync(getTrackFileUri(track)).then(
        () => {
          this.cachedDownloadStates.set(track.trackId, {
            type: "NOT_DOWNLOADED",
          })
          this.notify(track.trackId)
          this.transition(track, this.getRequestedDownloadState(track.trackId))
        },
        (error) => {
          console.error(`Failed to delete file of track ${track.trackId}`, error)
          this.cachedDownloadStates.set(track.trackId, currentState)
          this.notify(track.trackId)
          const requestedState = this.getRequestedDownloadState(track.trackId)
          if (requestedState !== "NOT_DOWNLOADED") {
            this.transition(track, requestedState)
          }
        },
      )
      this.cachedDownloadStates.set(track.trackId, {
        type: "DELETING",
      })
      this.notify(track.trackId)
    }
  }

  protected notify(trackId: string) {
    const entries = this.listeners.get(trackId) ?? []
    entries.forEach((callback) => callback())
  }

  private handleDownloadComplete(
    track: Track,
    // NOTE: The resolved promise is `null` on iOS if the download was paused or
    // cancelled despite the type signature of `downloadAsync` only allowing for
    // `undefined`.
    result: FileSystemDownloadResult | null | undefined,
  ): void {
    __DEV__ && console.log(`Handling downloaded track ${track.trackId}`, result)
    const currentState = this.getDownloadState(track.trackId)
    if (currentState.type === "DOWNLOADING") {
      if (result === undefined || result === null) {
        this.handleDownloadFailed(track, new Error("Download result is `null` or `undefined`"))
      } else {
        __DEV__ &&
          console.log(`Moving temporary file of track ${track.trackId} to persistent location`)
        const destination = getTrackFileUri(track)
        FileSystem.moveAsync({ from: result.uri, to: destination }).then(
          () => {
            cleanupDownloadResumable(currentState.downloadResumable)
            this.cachedDownloadStates.set(track.trackId, {
              type: "DOWNLOADED",
              uri: destination,
              // NOTE: The md5 field always exists since we set the { md5: true }
              // option above, therefore it's safe to assert `md5 !== undefined` here.
              md5: assertNotUndefined(result.md5),
            })
            this.notify(track.trackId)
            this.transition(track, this.getRequestedDownloadState(track.trackId))
          },
          (error) => {
            console.error(
              `Failed to move file of track ${track.trackId} to persistent location`,
              error,
            )
            this.handleDownloadFailed(track, error)
          },
        )
        this.cachedDownloadStates.set(track.trackId, {
          type: "FINALIZING",
          progress: 1,
          downloadResumable: currentState.downloadResumable,
        })
        this.notify(track.trackId)
      }
    }
  }

  private handleDownloadFailed(track: Track, error: Error): void {
    __DEV__ && console.error(`Failed to download track ${track.trackId}`, error)
    const currentState = this.getDownloadState(track.trackId)
    if (currentState.type === "DOWNLOADING" || currentState.type === "FINALIZING") {
      __DEV__ && console.log(`Deleting temporary file of track ${track.trackId}`)
      const afterDeletionAttempt = () => {
        cleanupDownloadResumable(currentState.downloadResumable)
        this.cachedDownloadStates.set(track.trackId, {
          type: "NOT_DOWNLOADED",
        })
        this.notify(track.trackId)
        const requestedState = this.getRequestedDownloadState(track.trackId)
        if (requestedState !== "DOWNLOADED") {
          this.transition(track, requestedState)
        }
      }
      FileSystem.deleteAsync(getTemporaryFileUri(track)).then(afterDeletionAttempt, (error) => {
        console.error(`Failed to delete temporary file of track ${track.trackId}`, error)
        afterDeletionAttempt()
      })
    }
  }
}

function cleanupDownloadResumable(downloadResumable: DownloadResumable): void {
  // TODO Instead of hoping that callbacks and subscriptions are being collected
  // by the garbage collector, we should clean up manually. I used to do this
  // with `resumableDownload._callback = undefined` and
  // `resumableDownload._removeSubscription()` which is not type-safe though.
}

function getTemporaryFileUri(track: Track) {
  return `${FileSystem.cacheDirectory}${track.trackId}.${track.fileExtension}`
}
