// Inspired by https://rossbulat.medium.com/react-native-how-to-load-and-play-audio-241808f97f61

import React, { useCallback, useEffect, useState } from "react"
import { AccessibilityRole, View, ViewStyle } from "react-native"
import { DownloadSwitch } from "../download-switch/download-switch"
import { Text } from "../text/text"
import { Audio, AVPlaybackStatus, AVPlaybackStatusToSet } from "expo-av"
import Slider from "@react-native-community/slider"
import { spacing } from "../../theme"
import { TextStyle } from "react-native"
import { useAudioSource } from "../../hooks/useAudioSource"
import { Divider, IconButton, useTheme } from "react-native-paper"
import { Section, SectionKind, Track, TrackKind } from "../../models"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { DownloadsSwitch } from "../downloads-switch"
import { useTrackStore } from "../../stores"

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
}
const TEXT: TextStyle = {
  textAlign: "center",
}
const HANDLE: ViewStyle = { marginHorizontal: spacing.tiny }
const ROW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  marginVertical: spacing.medium,
  marginHorizontal: spacing.medium,
}
const SLIDER_STYLE: ViewStyle = { flex: 1, alignSelf: "center", marginHorizontal: 10 }

type SliderState =
  | { type: "NORMAL" }
  | {
      type: "SLIDING"
      initialPlaybackPosition: number
      slidingPosition: number
    }

const loadAndPlay = async (
  uri: string,
  sound: Audio.Sound,
  initialStatus: AVPlaybackStatusToSet,
  onPlaybackStatusUpdate: (newPlaybackStatus: AVPlaybackStatus) => void,
) => {
  try {
    __DEV__ && console.log(`About to load and play ${uri}.`)
    await sound.unloadAsync()
    // Make sure audio is played if iOS is in silent mode, defaults to `false`.
    // NOTE: This sets the property globally which means _all_ future audio
    // playbacks will be affected.
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    await sound.loadAsync(
      { uri: uri },
      initialStatus,
      true, // downloadFirst
    )
  } catch (error) {
    __DEV__ && console.error("Failed to create, load, and play audio.", error)
  }
}

interface HandleProps {
  accessibilityLabel: string
  accessibilityRole?: AccessibilityRole
  disabled?: boolean
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]
  onPress: () => void
}

function Handle({
  accessibilityLabel,
  accessibilityRole = "button",
  disabled = false,
  icon,
  onPress,
}: HandleProps) {
  return (
    <IconButton
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessible={true}
      disabled={disabled}
      icon={(props) => <MaterialCommunityIcons name={icon} {...props} />}
      onMagicTap={onPress}
      onPress={onPress}
      size={30}
      style={HANDLE}
    />
  )
}

export interface AudioPlayerProps {
  section: Section
  track: Track
  backgroundMusic?: Track
  onPlaybackDidJustFinish: () => void
  previousTrack?: Track
  onPlayPreviousTrack: () => void
  nextTrack?: Track
  onPlayNextTrack: () => void
}

export function AudioPlayer({
  section,
  track,
  backgroundMusic,
  onPlaybackDidJustFinish,
  previousTrack,
  onPlayPreviousTrack,
  nextTrack,
  onPlayNextTrack,
}: AudioPlayerProps) {
  const exerciseAudioSource = useAudioSource(track)
  const backgroundAudioSource = useAudioSource(backgroundMusic ?? undefined)

  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))

  const [sound] = useState<Audio.Sound>(() => new Audio.Sound())
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null)
  const [sliderState, setSliderState] = useState<SliderState>({ type: "NORMAL" })

  const { colors } = useTheme()

  const playbackPosition = playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0
  const maximumPlaybackPosition =
    playbackStatus?.isLoaded && playbackStatus.durationMillis ? playbackStatus.durationMillis : 0
  const sliderPosition =
    sliderState.type === "NORMAL" ? playbackPosition : sliderState.slidingPosition

  const [backgroundSound] = useState<Audio.Sound | null>(() =>
    backgroundMusic === null ? null : new Audio.Sound(),
  )
  const [backgroundPlaybackStatus, setBackgroundPlaybackStatus] = useState<AVPlaybackStatus | null>(
    null,
  )

  // For why we use `useCallback` here see
  // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
  const onPlaybackStatusUpdate = useCallback(
    (newPlaybackStatus: AVPlaybackStatus) => {
      setPlaybackStatus(newPlaybackStatus)
      if (newPlaybackStatus.isLoaded && newPlaybackStatus.didJustFinish) {
        onPlaybackDidJustFinish()
      }
    },
    [onPlaybackDidJustFinish],
  )

  // For why we use `useCallback` here see
  // https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies
  const onBackgroundPlaybackStatusUpdate = useCallback((newPlaybackStatus: AVPlaybackStatus) => {
    setBackgroundPlaybackStatus(newPlaybackStatus)
  }, [])

  useEffect(() => {
    if (exerciseAudioSource) {
      loadAndPlay(
        exerciseAudioSource.uri,
        sound,
        {
          shouldPlay: !playbackStatus?.isLoaded || playbackStatus.shouldPlay,
          positionMillis: playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0,
        },
        onPlaybackStatusUpdate,
      )
    }
  }, [exerciseAudioSource?.uri, sound, onPlaybackStatusUpdate])

  useEffect(() => {
    if (backgroundAudioSource && backgroundSound) {
      loadAndPlay(
        backgroundAudioSource.uri,
        backgroundSound,
        { shouldPlay: true, isLooping: true, volume: 0.5 },
        onBackgroundPlaybackStatusUpdate,
      )
    }
  }, [backgroundAudioSource?.uri, backgroundSound, onBackgroundPlaybackStatusUpdate])

  useEffect(() => {
    return () => {
      sound.setOnPlaybackStatusUpdate(() => {})
      sound.unloadAsync()
    }
  }, [sound])

  useEffect(() => {
    return backgroundSound === null
      ? undefined
      : () => {
          backgroundSound.setOnPlaybackStatusUpdate(() => {})
          backgroundSound.unloadAsync()
        }
  }, [backgroundSound])

  const play = async () => {
    try {
      if (playbackStatus?.isLoaded) {
        await sound.playAsync()
      }
      if (backgroundSound && backgroundPlaybackStatus?.isLoaded) {
        await backgroundSound.playAsync()
      }
    } catch (error) {
      __DEV__ && console.error("Failed to play audio.", error)
    }
  }

  const pause = async () => {
    try {
      if (playbackStatus?.isLoaded && playbackStatus.shouldPlay) {
        await sound.pauseAsync()
      }
      if (
        backgroundSound &&
        backgroundPlaybackStatus?.isLoaded &&
        backgroundPlaybackStatus.shouldPlay
      ) {
        await backgroundSound.pauseAsync()
      }
    } catch (error) {
      __DEV__ && console.error("Failed to pause audio.", error)
    }
  }

  const startSliding = async (milliseconds: number) => {
    setSliderState({
      type: "SLIDING",
      initialPlaybackPosition: playbackPosition,
      slidingPosition: milliseconds,
    })
    await pause()
  }

  const slide = async (milliseconds: number) => {
    try {
      switch (sliderState.type) {
        // On Android with TalkBack when using volume buttons to adjust the
        // slider, the slider's `onSlidingStart` callback is not invoked and we
        // thus invoke it here if necessary. For the different possibilities to
        // slide with TalkBack see
        // https://support.google.com/accessibility/android/answer/6006598?hl=en
        case "NORMAL":
          await startSliding(milliseconds)
          break
        case "SLIDING":
          setSliderState({
            type: "SLIDING",
            initialPlaybackPosition: sliderState.initialPlaybackPosition,
            slidingPosition: milliseconds,
          })
          break
      }
    } catch (error) {
      console.error(`Failed to slide to ${milliseconds} milliseconds.`, error)
    }
  }

  const completeSliding = async (milliseconds: number) => {
    try {
      if (sliderState.type === "SLIDING") {
        setSliderState({
          type: "SLIDING",
          initialPlaybackPosition: sliderState.initialPlaybackPosition,
          slidingPosition: milliseconds,
        })
        if (playbackStatus?.isLoaded) {
          await sound.setPositionAsync(
            playbackStatus.durationMillis && milliseconds > playbackStatus.durationMillis
              ? playbackStatus.durationMillis
              : milliseconds,
          )
        }
        await play()
        setSliderState({ type: "NORMAL" })
      }
    } catch (error) {
      console.error(`Failed to slide to ${milliseconds} milliseconds.`, error)
    }
  }

  const jumpPrev30Seconds = () => jumpSeconds(-30)
  const jumpNext30Seconds = () => jumpSeconds(30)
  const jumpSeconds = async (seconds: number) => {
    try {
      if (playbackStatus?.isLoaded) {
        const milliseconds = seconds * 1000
        let nextMilliseconds = playbackStatus.positionMillis + milliseconds
        if (nextMilliseconds < 0) {
          nextMilliseconds = 0
        } else if (
          playbackStatus.durationMillis &&
          nextMilliseconds > playbackStatus.durationMillis
        ) {
          nextMilliseconds = playbackStatus.durationMillis
        }
        await sound.setPositionAsync(nextMilliseconds)
      }
    } catch (error) {
      __DEV__ && console.error(`Failed to jump ${seconds} seconds.`, error)
    }
  }

  const muteBackgroundMusic = async () => {
    try {
      if (backgroundSound && backgroundPlaybackStatus?.isLoaded) {
        await backgroundSound.setIsMutedAsync(true)
      }
    } catch (error) {
      __DEV__ && console.error("Failed to mute background music.", error)
    }
  }
  const unmuteBackgroundMusic = async () => {
    try {
      if (backgroundSound && backgroundPlaybackStatus?.isLoaded) {
        await backgroundSound.setIsMutedAsync(false)
      }
    } catch (error) {
      __DEV__ && console.error("Failed to un-mute background music.", error)
    }
  }

  const decreaseBackgroundMusicVolume = () => creaseBackgroundMusicVolume(-0.1)
  const increaseBackgroundMusicVolume = () => creaseBackgroundMusicVolume(0.1)
  const creaseBackgroundMusicVolume = async (amount: number) => {
    try {
      if (backgroundSound && backgroundPlaybackStatus?.isLoaded) {
        let nextVolume = backgroundPlaybackStatus.volume + amount
        if (nextVolume < 0) {
          nextVolume = 0
        } else if (nextVolume > 1) {
          nextVolume = 1
        }
        await backgroundSound.setVolumeAsync(nextVolume)
      }
    } catch (error) {
      __DEV__ &&
        console.error(`Failed to de- or increase background music volume by ${amount}.`, error)
    }
  }

  const padZero = (x: number) => (x < 10 ? "0" + x.toString() : x.toString())

  const convertToAudioTimeString = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const seconds = Math.floor((milliseconds / 1000) % 60)
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }

  const convertToAudioTimePhrase = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const seconds = Math.floor((milliseconds / 1000) % 60)
    return `${hours} Stunden, ${minutes} Minuten und ${seconds} Sekunden`
  }

  const convertTrackKindToSingularWord = (trackKind: TrackKind) => {
    switch (trackKind) {
      case TrackKind.Class:
        return "Stunde"
      case TrackKind.Pose:
        return "Übung"
      case TrackKind.Music:
        return "Musik"
    }
  }

  const convertSectionKindToSingularWord = (sectionKind: SectionKind) => {
    switch (sectionKind) {
      case SectionKind.General:
        return "Abschnitt"
      case SectionKind.Playlist:
        return "Playlist"
    }
  }

  const getTracksToDownload = () => {
    let tracks = section.data.map((trackId) => getTrack(trackId))
    if (backgroundMusic === undefined || backgroundMusic === null) {
      return tracks
    }
    return [...tracks, backgroundMusic]
  }

  const tracksToDownload = getTracksToDownload()

  return (
    <View
      style={ROOT}
      onMagicTap={() => {
        if (playbackStatus?.isLoaded) {
          if (playbackStatus.shouldPlay) {
            pause()
          } else {
            play()
          }
        }
      }}
      onAccessibilityEscape={previousTrack ? onPlayPreviousTrack : undefined}
    >
      {/* <AutoImage
          source={img_speaker}
          style={{ width: 150, height: 150, marginBottom: 15, alignSelf: "center" }}
        /> */}
      {!playbackStatus?.isLoaded && playbackStatus?.error && (
        <View style={ROW}>
          <Text style={TEXT}>Error: {playbackStatus.error}</Text>
        </View>
      )}
      <View style={ROW}>
        <Text style={TEXT}>{track.name}</Text>
      </View>
      <View style={ROW}>
        <Handle
          icon="skip-backward"
          disabled={!previousTrack}
          accessibilityLabel={`Vorheriges Stück abspielen ${previousTrack?.name}`}
          onPress={onPlayPreviousTrack}
        />
        <Handle
          icon="step-backward"
          accessibilityLabel="30 Sekunden zurückspulen"
          onPress={jumpPrev30Seconds}
        />
        {!playbackStatus?.isLoaded && (
          <Handle
            disabled={true}
            icon="clock"
            accessibilityLabel="wird geladen"
            accessibilityRole="text"
            onPress={() => {}}
          />
        )}
        {playbackStatus?.isLoaded && !playbackStatus.shouldPlay && (
          <Handle icon="play-circle" accessibilityLabel="abspielen" onPress={play} />
        )}
        {playbackStatus?.isLoaded && playbackStatus.shouldPlay && (
          <Handle icon="pause-circle" accessibilityLabel="pausieren" onPress={pause} />
        )}
        <Handle
          icon="step-forward"
          accessibilityLabel="30 Sekunden vorspulen"
          onPress={jumpNext30Seconds}
        />
        <Handle
          icon="skip-forward"
          disabled={!nextTrack}
          accessibilityLabel={`Nächstes Stück abspielen ${nextTrack?.name}`}
          onPress={onPlayNextTrack}
        />
      </View>
      <View style={ROW}>
        <Text
          accessible={true}
          accessibilityLabel={convertToAudioTimePhrase(sliderPosition)}
          accessibilityHint="Spielzeit"
          accessibilityRole="text"
          style={TEXT}
        >
          {convertToAudioTimeString(sliderPosition)}
        </Text>
        <Slider
          accessible={true}
          accessibilityLabel={`
              ${
                playbackStatus?.isLoaded && playbackStatus.durationMillis
                  ? Math.round(
                      (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100,
                    )
                  : 0
              }%
            `}
          accessibilityHint="prozentuale Spielzeit"
          accessibilityRole="adjustable"
          accessibilityValue={{ min: 0, max: maximumPlaybackPosition, now: sliderPosition }}
          value={
            sliderState.type === "NORMAL" ? playbackPosition : sliderState.initialPlaybackPosition
          }
          minimumValue={0}
          maximumValue={maximumPlaybackPosition}
          maximumTrackTintColor={colors.disabled}
          minimumTrackTintColor={colors.text}
          thumbTintColor={colors.text}
          style={SLIDER_STYLE}
          onSlidingStart={startSliding}
          onValueChange={slide}
          onSlidingComplete={completeSliding}
        />
        <Text
          accessible={true}
          accessibilityLabel={convertToAudioTimePhrase(maximumPlaybackPosition)}
          accessibilityHint="Spieldauer"
          accessibilityRole="text"
          style={TEXT}
        >
          {convertToAudioTimeString(maximumPlaybackPosition)}
        </Text>
      </View>
      {backgroundMusic && (
        <View style={ROW}>
          <Handle
            icon="volume-low"
            accessibilityLabel="Hintergrundmusik leiser machen"
            onPress={decreaseBackgroundMusicVolume}
          />
          {backgroundPlaybackStatus?.isLoaded && backgroundPlaybackStatus.isMuted && (
            <Handle
              icon="volume-medium"
              accessibilityLabel="laut stellen"
              onPress={unmuteBackgroundMusic}
            />
          )}
          {backgroundPlaybackStatus?.isLoaded && !backgroundPlaybackStatus.isMuted && (
            <Handle
              icon="volume-off"
              accessibilityLabel="stumm schalten"
              onPress={muteBackgroundMusic}
            />
          )}
          <Handle
            icon="volume-high"
            accessibilityLabel="Hintergrundmusik lauter machen"
            onPress={increaseBackgroundMusicVolume}
          />
        </View>
      )}
      <DownloadSwitch title={convertTrackKindToSingularWord(section.trackKind)} track={track} />

      {tracksToDownload.length >= 2 && (
        <>
          <Divider />
          <DownloadsSwitch
            title={convertSectionKindToSingularWord(section.kind)}
            tracks={tracksToDownload}
          />
          <Divider />
          {tracksToDownload.map((trackToDownload) => (
            <DownloadSwitch title={trackToDownload.name} track={trackToDownload} />
          ))}
        </>
      )}
    </View>
  )
}
