import { DownloadResumable, FileSystemDownloadResult } from "expo-file-system"
import { produce } from "immer"
import { FileSystem } from "react-native-unimodules"
import create, { GetState, SetState } from "zustand"
import { Track } from "../models"
import { getTrackFileUri } from "../utils/file"

export enum DownloadStatus {
  Unknown = "UNKNOWN",
  Deleting = "DELETING",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloading = "DOWNLOADING",
  Downloaded = "DOWNLOADED",
}

export enum DownloadStatusToBe {
  Unknown = "UNKNOWN",
  NotDownloaded = "NOT_DOWNLOADED",
  Downloaded = "DOWNLOADED",
}

export enum DownloadStatusWishedFor {
  NotDownloaded = "NOT_DOWNLOADED",
  Downloaded = "DOWNLOADED",
}

type AbortSignal = {
  aborted: boolean
}

export function toDownloadStatusToBe(status: DownloadStatus) {
  switch (status) {
    case DownloadStatus.Unknown:
      return DownloadStatusToBe.Unknown
    case DownloadStatus.Deleting:
    case DownloadStatus.NotDownloaded:
      return DownloadStatusToBe.NotDownloaded
    case DownloadStatus.Downloading:
    case DownloadStatus.Downloaded:
      return DownloadStatusToBe.Downloaded
  }
}

function getTemporaryFileUri(track: Track) {
  return `${FileSystem.cacheDirectory}${track.trackId}.${track.fileExtension}`
}

type State = {
  statuses: Map<string, DownloadStatus>
  wishes: Map<string, [DownloadStatusWishedFor, AbortSignal]>
  progressPercentages: Map<string, number>
  resumableDownloads: Map<string, DownloadResumable>
  updateTrackProgressPercentageCallbacks: Map<
    string,
    Set<(trackId: string, percentage: number) => void>
  >
  onDownloadCompleteCallbacks: Map<
    string,
    Set<(trackId: string, targetFileUri: string) => Promise<void>>
  >
  onDownloadJustAboutToBeDeletedCallbacks: Map<
    string,
    Set<(trackId: string, sourceWebUri: string) => Promise<void>>
  >
  determineStatus: (track: Track) => Promise<void>
  getStatus: (trackId: string) => DownloadStatus
  getProgressPercentage: (trackId: string) => number
  getResumableDownload: (trackId: string) => DownloadResumable | null
  getUpdateTrackProgressPercentageCallbacks: (
    trackId: string,
  ) => Set<(trackId: string, percentage: number) => void>
  addUpdateTrackProgressPercentageCallback: (
    trackId: string,
    callback: (trackId: string, percentage: number) => void,
  ) => void
  removeUpdateTrackProgressPercentageCallback: (
    trackId: string,
    callback: (trackId: string, percentage: number) => void,
  ) => void
  getOnDownloadCompleteCallbacks: (
    trackId: string,
  ) => Set<(trackId: string, targetFileUri: string) => Promise<void>>
  addOnDownloadCompleteCallback: (
    trackId: string,
    callback: (trackId: string, targetFileUri: string) => Promise<void>,
  ) => void
  removeOnDownloadCompleteCallback: (
    trackId: string,
    callback: (trackId: string, targetFileUri: string) => Promise<void>,
  ) => void
  getOnDownloadJustAboutToBeDeletedCallbacks: (
    trackId: string,
  ) => Set<(trackId: string, sourceWebUri: string) => Promise<void>>
  addOnDownloadJustAboutToBeDeletedCallback: (
    trackId: string,
    callback: (trackId: string, sourceWebUri: string) => Promise<void>,
  ) => void
  removeOnDownloadJustAboutToBeDeletedCallback: (
    trackId: string,
    callback: (trackId: string, sourceWebUri: string) => Promise<void>,
  ) => void
  wishForStatus: (track: Track, statusWishedFor: DownloadStatusWishedFor) => Promise<void>
}

const handleDownload = async (
  track: Track,
  abortSignal: AbortSignal,
  set: SetState<State>,
  get: GetState<State>,
  download: () => Promise<FileSystemDownloadResult>,
) => {
  // TODO Check `newAbortSignal.aborted` after every `await`?
  set(
    produce((state) => {
      state.statuses.set(track.trackId, DownloadStatus.Downloading)
    }),
  )
  const { uri, md5, status: statusCode } = await download()
  if (abortSignal.aborted) {
    throw `Aborted downloading track ${track.trackId} during download process.`
  }
  if (statusCode !== 200) {
    console.warn(
      `Downloading track ${track.trackId} responded with HTTP status code ${statusCode}, expected 200.`,
    )
  }
  if (md5 !== track.md5FileHashValue) {
    // TODO Delete downloaded file?
    console.error(
      `Downloaded track ${track.trackId} has wrong md5 hash value ${md5}, expected ${track.md5FileHashValue}.`,
    )
  }
  __DEV__ && console.log(`Downloaded track ${track.trackId}.`)
  const resumableDownload = get().getResumableDownload(track.trackId)
  if (resumableDownload !== null) {
    resumableDownload._callback = undefined
    resumableDownload._removeSubscription()
  }
  set(produce((state) => state.resumableDownloads.set(track.trackId, null)))
  await FileSystem.moveAsync({ from: uri, to: getTrackFileUri(track) })
  if (abortSignal.aborted) {
    throw `Aborted downloading track ${track.trackId} during moving process.`
  }
  set(produce((state) => state.statuses.set(track.trackId, DownloadStatus.Downloaded)))
  // TODO Should we abort notification when abort signal occurs although download has actually already finished and state was updated?
  await Promise.all(
    // TODO We use the spread operator here which is inefficient because `Set`s do not have `map`. Do this more efficiently!
    [...get().getOnDownloadCompleteCallbacks(track.trackId)].map((onDownloadComplete) =>
      onDownloadComplete(track.trackId, getTrackFileUri(track)),
    ),
  )
}

const callUpdateTrackProgressPercentageCallbacks = (
  callbacks: Set<(trackId: string, percentage: number) => void>,
  trackId: string,
  percentage: number,
) => {
  for (const updateTrackProgressPercentage of callbacks) {
    updateTrackProgressPercentage(trackId, percentage)
  }
}

export const useDownloadStore = create<State>((set, get) => ({
  statuses: new Map<string, DownloadStatus>(),
  wishes: new Map<string, [DownloadStatusWishedFor, AbortSignal]>(),
  progressPercentages: new Map<string, number>(),
  resumableDownloads: new Map<string, DownloadResumable>(),
  updateTrackProgressPercentageCallbacks: new Map<
    string,
    Set<(trackId: string, percentage: number) => void>
  >(),
  onDownloadCompleteCallbacks: new Map<
    string,
    Set<(trackId: string, targetFileUri: string) => Promise<void>>
  >(),
  onDownloadJustAboutToBeDeletedCallbacks: new Map<
    string,
    Set<(trackId: string, sourceWebUri: string) => Promise<void>>
  >(),
  determineStatus: async (track: Track) => {
    try {
      if (get().getStatus(track.trackId) === DownloadStatus.Unknown) {
        const { exists } = await FileSystem.getInfoAsync(getTrackFileUri(track))
        if (get().getStatus(track.trackId) === DownloadStatus.Unknown) {
          set(
            produce((state) =>
              state.statuses.set(
                track.trackId,
                exists ? DownloadStatus.Downloaded : DownloadStatus.NotDownloaded,
              ),
            ),
          )
        }
      }
    } catch (error) {
      console.error(`Failed to determine download status of track ${track.trackId}.`, error)
    }
  },
  getStatus: (trackId: string) => get().statuses.get(trackId) || DownloadStatus.Unknown,
  getProgressPercentage: (trackId: string) => get().progressPercentages.get(trackId) || 0,
  getResumableDownload: (trackId: string) => get().resumableDownloads.get(trackId) || null,
  getUpdateTrackProgressPercentageCallbacks: (trackId: string) =>
    get().updateTrackProgressPercentageCallbacks.get(trackId) || new Set(),
  addUpdateTrackProgressPercentageCallback: (
    trackId: string,
    callback: (trackId: string, percentage: number) => void,
  ) =>
    set(
      produce((state) =>
        state.updateTrackProgressPercentageCallbacks.has(trackId)
          ? state.updateTrackProgressPercentageCallbacks.get(trackId).add(callback)
          : state.updateTrackProgressPercentageCallbacks.set(trackId, new Set([callback])),
      ),
    ),
  removeUpdateTrackProgressPercentageCallback: (
    trackId: string,
    callback: (trackId: string, percentage: number) => void,
  ) =>
    set(
      produce((state) =>
        state.updateTrackProgressPercentageCallbacks.get(trackId)?.delete(callback),
      ),
    ),
  getOnDownloadCompleteCallbacks: (trackId: string) =>
    get().onDownloadCompleteCallbacks.get(trackId) || new Set(),
  addOnDownloadCompleteCallback: (
    trackId: string,
    callback: (trackId: string, targetFileUri: string) => Promise<void>,
  ) =>
    set(
      produce((state) =>
        state.onDownloadCompleteCallbacks.has(trackId)
          ? state.onDownloadCompleteCallbacks.get(trackId).add(callback)
          : state.onDownloadCompleteCallbacks.set(trackId, new Set([callback])),
      ),
    ),
  removeOnDownloadCompleteCallback: (
    trackId: string,
    callback: (trackId: string, targetFileUri: string) => Promise<void>,
  ) => set(produce((state) => state.onDownloadCompleteCallbacks.get(trackId)?.delete(callback))),
  getOnDownloadJustAboutToBeDeletedCallbacks: (trackId: string) =>
    get().onDownloadJustAboutToBeDeletedCallbacks.get(trackId) || new Set(),
  addOnDownloadJustAboutToBeDeletedCallback: (
    trackId: string,
    callback: (trackId: string, sourceWebUri: string) => Promise<void>,
  ) =>
    set(
      produce((state) =>
        state.onDownloadJustAboutToBeDeletedCallbacks.has(trackId)
          ? state.onDownloadJustAboutToBeDeletedCallbacks.get(trackId).add(callback)
          : state.onDownloadJustAboutToBeDeletedCallbacks.set(trackId, new Set([callback])),
      ),
    ),
  removeOnDownloadJustAboutToBeDeletedCallback: (
    trackId: string,
    callback: (trackId: string, sourceWebUri: string) => Promise<void>,
  ) =>
    set(
      produce((state) =>
        state.onDownloadJustAboutToBeDeletedCallbacks.get(trackId)?.delete(callback),
      ),
    ),
  wishForStatus: async (track: Track, statusWishedFor: DownloadStatusWishedFor) => {
    const [previousWish, previousAbortSignal] = get().wishes.get(track.trackId) || [null, null]
    if (previousWish !== statusWishedFor) {
      previousAbortSignal.aborted = true
      const abortSignal = { aborted: false }
      set(produce((state) => state.wishes.set(track.trackId, [statusWishedFor, abortSignal])))
      switch (get().getStatus(track.trackId)) {
        case DownloadStatus.Unknown:
          __DEV__ &&
            console.log(
              `Cannot fulfill status wish ${statusWishedFor} for track ${track.trackId} with status ${DownloadStatus.Unknown}`,
            )
          break
        case DownloadStatus.Deleting:
        case DownloadStatus.NotDownloaded:
          switch (statusWishedFor) {
            case DownloadStatusWishedFor.NotDownloaded:
              __DEV__ &&
                console.log(
                  `Already fulfilling status wish ${statusWishedFor} for track ${track.trackId}`,
                )
              break
            case DownloadStatusWishedFor.Downloaded:
              __DEV__ && console.log(`Downloading track ${track.trackId}`)
              await handleDownload(track, abortSignal, set, get, () => {
                let resumableDownload = get().getResumableDownload(track.trackId)
                if (resumableDownload === null) {
                  resumableDownload = FileSystem.createDownloadResumable(
                    track.webUri,
                    getTemporaryFileUri(track),
                    { md5: true },
                    ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
                      callUpdateTrackProgressPercentageCallbacks(
                        get().getUpdateTrackProgressPercentageCallbacks(track.trackId),
                        track.trackId,
                        totalBytesWritten / totalBytesExpectedToWrite,
                      )
                    },
                  )
                  set(
                    produce((state) =>
                      state.resumableDownloads.set(track.trackId, resumableDownload),
                    ),
                  )
                  return resumableDownload.downloadAsync()
                } else {
                  return resumableDownload.resumeAsync()
                }
              })
              break
          }
          break
        case DownloadStatus.Downloading:
          switch (statusWishedFor) {
            case DownloadStatusWishedFor.NotDownloaded:
              __DEV__ && console.log(`Pausing download of track ${track.trackId}`)
              const resumableDownload = get().getResumableDownload(track.trackId)
              if (resumableDownload === null) {
                __DEV__ &&
                  console.warn(
                    `Track ${track.trackId} has status ${DownloadStatus.Downloading} but no resumable download`,
                  )
              } else {
                set(produce((state) => state.statuses.set(track.trackId, DownloadStatus.Deleting)))
                await resumableDownload.pauseAsync()
                if (abortSignal.aborted) {
                  throw `Aborted pausing track ${track.trackId}.`
                }
                set(
                  produce((state) =>
                    state.statuses.set(track.trackId, DownloadStatus.NotDownloaded),
                  ),
                )
              }
              break
            case DownloadStatusWishedFor.Downloaded:
              __DEV__ &&
                console.log(
                  `Already fulfilling status wish ${statusWishedFor} for track ${track.trackId}`,
                )
              break
          }
          break
        case DownloadStatus.Downloaded:
          switch (statusWishedFor) {
            case DownloadStatusWishedFor.NotDownloaded:
              __DEV__ && console.log(`Deleting track ${track.trackId}`)
              set(produce((state) => state.statuses.set(track.trackId, DownloadStatus.Deleting)))
              await Promise.all(
                // TODO We use the spread operator here which is inefficient because `Set`s do not have `map`. Do this more efficiently!
                [...get().getOnDownloadJustAboutToBeDeletedCallbacks(track.trackId)].map(
                  (onDownloadJustAboutToBeDeleted) => {
                    if (abortSignal.aborted) {
                      throw `Aborted deleting track ${track.trackId} during individual notification process.`
                    }
                    return onDownloadJustAboutToBeDeleted(track.trackId, track.webUri)
                  },
                ),
              )
              if (abortSignal.aborted) {
                throw `Aborted deleting track ${track.trackId} during notification process.`
              }
              await FileSystem.deleteAsync(getTrackFileUri(track))
              if (abortSignal.aborted) {
                throw `Aborted deleting track ${track.trackId} during deletion process.`
              }
              callUpdateTrackProgressPercentageCallbacks(
                get().getUpdateTrackProgressPercentageCallbacks(track.trackId),
                track.trackId,
                0,
              )
              set(
                produce((state) => state.statuses.set(track.trackId, DownloadStatus.NotDownloaded)),
              )
              break
            case DownloadStatusWishedFor.Downloaded:
              __DEV__ &&
                console.log(
                  `Already fulfilling status wish ${statusWishedFor} for track ${track.trackId}`,
                )
              break
          }
          break
      }
    }
  },
}))
