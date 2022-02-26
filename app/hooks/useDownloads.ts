import {
  TransitionAction,
  DownloadState,
  RequestedDownloadState,
} from "../clients/TrackDownloadsClient"
import { Track } from "../models"
import { useDownload } from "./useDownload"

export enum AccumulatedTransitionAction {
  None = "NONE",
  Start = "START",
  Cancel = "CANCEL",
  Delete = "DELETE",
}

export type AccumulatedTransition = {
  perform: () => void
  action: AccumulatedTransitionAction
}

export type AccumulatedDownloadState =
  | { type: "UNKNOWN" }
  | { type: "FINALIZING"; progress: 1 }
  | { type: "CANCELLING"; progress: number }
  | { type: "DELETING" }
  | { type: "FINALIZING_OR_CANCELLING_OR_DELETING"; progress: number }
  | { type: "NOT_DOWNLOADED"; progress: number }
  | { type: "DOWNLOADING"; progress: number }
  | { type: "DOWNLOADED" }

function getState(states: DownloadState[]): AccumulatedDownloadState {
  if (states.some((state) => state.type === "UNKNOWN")) {
    return { type: "UNKNOWN" }
  }
  if (
    states.some((state) => state.type === "FINALIZING") &&
    states.every((state) => state.type === "FINALIZING" || state.type === "DOWNLOADED")
  ) {
    return { type: "FINALIZING", progress: 1 }
  }
  if (
    states.some((state) => state.type === "CANCELLING") &&
    states.every((state) => state.type === "CANCELLING" || state.type === "NOT_DOWNLOADED")
  ) {
    return { type: "CANCELLING", progress: computeProgressPercentage(states) }
  }
  if (
    states.some((state) => state.type === "DELETING") &&
    states.every((state) => state.type === "DELETING" || state.type === "NOT_DOWNLOADED")
  ) {
    return { type: "DELETING" }
  }
  if (
    states.some(
      (state) =>
        state.type === "FINALIZING" || state.type === "CANCELLING" || state.type === "DELETING",
    )
  ) {
    return {
      type: "FINALIZING_OR_CANCELLING_OR_DELETING",
      progress: computeProgressPercentage(states),
    }
  }
  if (states.some((state) => state.type === "NOT_DOWNLOADED")) {
    return { type: "NOT_DOWNLOADED", progress: computeProgressPercentage(states) }
  }
  if (states.some((state) => state.type === "DOWNLOADING")) {
    return {
      type: "DOWNLOADING",
      progress: computeProgressPercentage(states),
    }
  }
  return { type: "DOWNLOADED" }
}

function getRequestedState(states: RequestedDownloadState[]): RequestedDownloadState {
  if (states.every((state) => state === "DOWNLOADED")) {
    return "DOWNLOADED"
  }
  if (states.every((state) => state === "NOT_DOWNLOADED")) {
    return "NOT_DOWNLOADED"
  }
  return "NONE"
}

function computeProgressPercentage(states: DownloadState[]) {
  let sum = 0
  for (const state of states) {
    switch (state.type) {
      case "DOWNLOADING":
      case "FINALIZING":
      case "CANCELLING":
        sum += state.progress
        break
      case "DOWNLOADED":
      case "DELETING":
        sum += 1
        break
      default:
        sum += 0
    }
  }
  return states.length === 0 ? 1 : sum / states.length
}

type UseDownloadsResult = {
  state: AccumulatedDownloadState
  requestedState: RequestedDownloadState
  failed: boolean
  transition: AccumulatedTransition
}

export function useDownloads(tracks: Track[]): UseDownloadsResult {
  // NOTE: According to
  // https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
  // hooks shouldn't be called inside loops. It's safe to do it here though
  // because we call hooks in the same order on each render.
  const useDownloadResults = tracks.map((track) => useDownload(track))

  const currentState = getState(useDownloadResults.map((r) => r.state))
  const requestedState = getRequestedState(useDownloadResults.map((r) => r.requestedState))
  const failed = useDownloadResults.some((r) => r.failed)

  return {
    state: currentState,
    requestedState: requestedState,
    failed: failed,
    transition: (() => {
      const transitions = useDownloadResults.map((r) => r.transition)
      switch (currentState.type) {
        case "UNKNOWN":
          return {
            perform: () => {},
            action: AccumulatedTransitionAction.None,
          }
        case "NOT_DOWNLOADED":
        case "CANCELLING":
        case "DELETING":
        case "FINALIZING_OR_CANCELLING_OR_DELETING":
          return {
            perform: () => {
              for (const { perform, action } of transitions) {
                if (action === TransitionAction.Start) {
                  perform()
                }
              }
            },
            action: AccumulatedTransitionAction.Start,
          }
        case "DOWNLOADING":
        case "FINALIZING":
          return {
            perform: () => {
              for (const { perform, action } of transitions) {
                if (action === TransitionAction.Cancel || action === TransitionAction.Delete) {
                  perform()
                }
              }
            },
            action: AccumulatedTransitionAction.Cancel,
          }
        case "DOWNLOADED":
          return {
            perform: () => {
              for (const { perform, action } of transitions) {
                if (action === TransitionAction.Delete) {
                  perform()
                }
              }
            },
            action: AccumulatedTransitionAction.Delete,
          }
      }
    })(),
  }
}
