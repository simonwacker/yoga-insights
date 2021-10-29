import { Track } from "../models"
import { useDownload } from "./useDownload"

type UseAudioSourceResult =
  | { uri: string; isWebSource: true; isFileSource: false }
  | { uri: string; isWebSource: false; isFileSource: true }

// NOTE: The argument is optional to support conditionally rendering hooks.
// E.g. if you only want to get the audio source if some condition is met
// you can't wrap `useAudioSource` in an `if` block, see
// https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level.
// To work around this you can pass in `undefined` here.
export function useAudioSource(track: Track | undefined): UseAudioSourceResult | undefined {
  if (track === undefined) {
    return undefined
  }

  const { state } = useDownload(track)

  if (state.type === "UNKNOWN") {
    return undefined
  }

  if (state.type === "DOWNLOADED") {
    return { uri: state.uri, isFileSource: true, isWebSource: false }
  } else {
    return { uri: track.webUri, isFileSource: false, isWebSource: true }
  }
}

