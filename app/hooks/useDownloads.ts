import { DownloadState } from "../clients/TrackDownloadsClient"
import { Track } from "../models"
import { TransitionAction, useDownload } from "./useDownload"

export enum AccumulatedTransitionAction {
  Start = "START",
  Cancel = "CANCEL",
  Delete = "DELETE",
}

export type AccumulatedTransition = {
  transit: () => void
  action: AccumulatedTransitionAction
}

export type AccumulatedDownloadState =
  | { type: "UNKNOWN" }
  | { type: "FINALIZING"; progress: 1 }
  | { type: "CANCELLING"; progress: number }
  | { type: "DELETING" }
  | { type: "FINALIZING_OR_CANCELLING_OR_DELETING"; progress: number }
  | { type: "FAILED_DOWNLOADING"; progress: number }
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
    states.every(
      (state) =>
        state.type === "CANCELLING" ||
        state.type === "FAILED_DOWNLOADING" ||
        state.type === "NOT_DOWNLOADED",
    )
  ) {
    return { type: "CANCELLING", progress: computeProgressPercentage(states) }
  }
  if (
    states.some((state) => state.type === "DELETING") &&
    states.every(
      (state) =>
        state.type === "DELETING" ||
        state.type === "FAILED_DOWNLOADING" ||
        state.type === "NOT_DOWNLOADED",
    )
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
  if (states.some((state) => state.type === "FAILED_DOWNLOADING")) {
    return { type: "FAILED_DOWNLOADING", progress: computeProgressPercentage(states) }
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

// Taken from https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array/46700791#46700791
// Another option would be https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array/59726888#59726888
// See also https://github.com/microsoft/TypeScript/issues/16069
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

type UseDownloadsResult = {
  state: AccumulatedDownloadState
  transition: AccumulatedTransition | null
}

export function useDownloads(tracks: Track[]): UseDownloadsResult {
  // NOTE: According to
  // https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level
  // hooks shouldn't be called inside loops. It's safe to do it here though
  // because we call hooks in the same order on each render.
  const useDownloadResults = tracks.map((track) => useDownload(track))

  const currentState = getState(useDownloadResults.map((r) => r.state))

  return {
    state: currentState,
    transition:
      currentState.type === "UNKNOWN"
        ? null
        : (() => {
            const transitions = useDownloadResults.map((r) => r.transition).filter(notEmpty)
            switch (currentState.type) {
              case "NOT_DOWNLOADED":
              case "CANCELLING":
              case "DELETING":
              case "FINALIZING_OR_CANCELLING_OR_DELETING":
              case "FAILED_DOWNLOADING":
                return {
                  transit: () => {
                    for (const { perform: transit, action } of transitions) {
                      if (action === TransitionAction.Start) {
                        transit()
                      }
                    }
                  },
                  action: AccumulatedTransitionAction.Start,
                }
              case "DOWNLOADING":
              case "FINALIZING":
                return {
                  transit: () => {
                    for (const { perform: transit, action } of transitions) {
                      if (
                        action === TransitionAction.Cancel ||
                        action === TransitionAction.Delete
                      ) {
                        transit()
                      }
                    }
                  },
                  action: AccumulatedTransitionAction.Cancel,
                }
              case "DOWNLOADED":
                return {
                  transit: () => {
                    for (const { perform: transit, action } of transitions) {
                      if (action === TransitionAction.Delete) {
                        transit()
                      }
                    }
                  },
                  action: AccumulatedTransitionAction.Delete,
                }
            }
          })(),
  }
}
