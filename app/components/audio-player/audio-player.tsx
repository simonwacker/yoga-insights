// Inspired by https://rossbulat.medium.com/react-native-how-to-load-and-play-audio-241808f97f61

import React, { useCallback, useEffect, useState } from "react"
import { Pressable, View, ViewStyle } from "react-native"
import { DownloadSwitch } from "../download-switch/download-switch"
import { Text } from "../text/text"
import { Audio, AVPlaybackStatus, AVPlaybackStatusToSet } from "expo-av"
import Slider from "@react-native-community/slider"
import { AntDesign, FontAwesome5 } from "@expo/vector-icons"
import { FileSystem } from "react-native-unimodules"
import { AudioPlayerProps } from "./audio-player.props"
import { color, spacing } from "../../theme"
import { TextStyle } from "react-native"
import { scale } from "../../theme/scale"
import { getTrackFileUri } from "../../utils/file"

const ROOT: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
}
const TEXT: TextStyle = {
  textAlign: "center",
}
const HANDLE: ViewStyle = { marginHorizontal: spacing.medium }
const HANDLE_TEXT: TextStyle = { fontSize: scale.tiny }
const ROW: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  marginVertical: spacing.medium,
  marginHorizontal: spacing.medium,
}
const SLIDER_STYLE: ViewStyle = { flex: 1, alignSelf: "center", marginHorizontal: 10 }

const loadAndPlay = async (
  fileUri: string,
  webUri: string,
  sound: Audio.Sound,
  initialStatus: AVPlaybackStatusToSet,
  onPlaybackStatusUpdate: (newPlaybackStatus: AVPlaybackStatus) => void,
) => {
  try {
    __DEV__ && console.log(`About to load and play ${fileUri} or ${webUri}.`)
    await sound.unloadAsync()
    // Make sure audio is played if iOS is in silent mode, defaults to `false`.
    // NOTE: This sets the property globally which means _all_ future audio
    // playbacks will be affected.
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    const { exists } = await FileSystem.getInfoAsync(fileUri)
    const uri = exists ? fileUri : webUri
    await sound.loadAsync(
      { uri: uri },
      initialStatus,
      true, // downloadFirst
    )
  } catch (error) {
    __DEV__ && console.error("Failed to create, load, and play audio.", error)
  }
}

export function AudioPlayer({
  track,
  backgroundMusic,
  tracksToDownload,
  onPlaybackDidJustFinish,
  previousTrack,
  onPlayPreviousTrack,
  nextTrack,
  onPlayNextTrack,
}: AudioPlayerProps) {
  const fileUri = getTrackFileUri(track)
  const backgroundFileUri = backgroundMusic === null ? null : getTrackFileUri(backgroundMusic)

  const [sound] = useState<Audio.Sound>(() => new Audio.Sound())
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(null)

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
    loadAndPlay(fileUri, track.webUri, sound, { shouldPlay: true }, onPlaybackStatusUpdate)
  }, [fileUri, track.webUri, sound, onPlaybackStatusUpdate])

  useEffect(() => {
    if (backgroundFileUri && backgroundMusic?.webUri && backgroundSound) {
      loadAndPlay(
        backgroundFileUri,
        backgroundMusic.webUri,
        backgroundSound,
        { shouldPlay: true, isLooping: true, volume: 0.5 },
        onBackgroundPlaybackStatusUpdate,
      )
    }
  }, [
    backgroundFileUri,
    backgroundMusic?.webUri,
    backgroundSound,
    onBackgroundPlaybackStatusUpdate,
  ])

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

  const jumpPrev30Seconds = () => jumpSeconds(-30)
  const jumpNext30Seconds = () => jumpSeconds(30)
  const jumpSeconds = async (seconds: number) => {
    try {
      if (playbackStatus?.isLoaded) {
        const milliseconds = seconds * 1000
        let nextMilliseconds = playbackStatus.positionMillis + milliseconds
        if (nextMilliseconds < 0) {
          nextMilliseconds = 0
        } else if (nextMilliseconds > playbackStatus.durationMillis) {
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

  const conertToAudioTimeString = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const seconds = Math.floor((milliseconds / 1000) % 60)
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }

  const conertToAudioTimePhrase = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60)
    const seconds = Math.floor((milliseconds / 1000) % 60)
    return `${hours} Stunden, ${minutes} Minuten und ${seconds} Sekunden`
  }

  const switchSource = async (trackId: string, uri: string) => {
    if (trackId === track.trackId) {
      const oldPlaybackStatus = playbackStatus
      await sound.unloadAsync()
      await sound.loadAsync(
        { uri: uri },
        {
          shouldPlay: !oldPlaybackStatus?.isLoaded || oldPlaybackStatus.shouldPlay,
          positionMillis: oldPlaybackStatus?.isLoaded ? oldPlaybackStatus.positionMillis : 0,
        },
        true,
      )
    }
  }

  return (
    <View style={ROOT}>
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
        <Pressable
          disabled={!previousTrack}
          accessible={true}
          accessibilityLabel={`Vorheriges Stück abspielen ${previousTrack?.name}`}
          accessibilityRole="button"
          onPress={onPlayPreviousTrack}
          style={HANDLE}
        >
          <AntDesign name="stepbackward" size={30} color={color.text} />
        </Pressable>
        <Pressable
          accessible={true}
          accessibilityLabel="30 Sekunden zurückspulen"
          accessibilityRole="button"
          onPress={jumpPrev30Seconds}
          style={HANDLE}
        >
          <AntDesign name="left" size={30} color={color.text} />
          {/* <AutoImage source={img_playjumpleft} style={{ width: 30, height: 30 }} /> */}
          <Text style={HANDLE_TEXT}>30</Text>
        </Pressable>
        {!playbackStatus?.isLoaded && (
          <AntDesign
            accessible={true}
            accessibilityLabel="wird geladen"
            accessibilityRole="text"
            name="loading1"
            size={30}
            color={color.text}
            style={HANDLE}
          />
        )}
        {playbackStatus?.isLoaded && !playbackStatus.shouldPlay && (
          <Pressable
            accessible={true}
            accessibilityLabel="abspielen"
            accessibilityRole="button"
            onPress={play}
            style={HANDLE}
          >
            <AntDesign name="playcircleo" size={30} color={color.text} />
            {/* <AutoImage source={img_play} style={{ width: 30, height: 30 }} /> */}
          </Pressable>
        )}
        {playbackStatus?.isLoaded && playbackStatus.shouldPlay && (
          <Pressable
            accessible={true}
            accessibilityLabel="pausieren"
            accessibilityRole="button"
            onPress={pause}
            style={HANDLE}
          >
            <AntDesign name="pausecircleo" size={30} color={color.text} />
            {/* <AutoImage source={img_pause} style={{ width: 30, height: 30 }} /> */}
          </Pressable>
        )}
        <Pressable
          accessible={true}
          accessibilityLabel="30 Sekunden vorspulen"
          accessibilityRole="button"
          onPress={jumpNext30Seconds}
          style={HANDLE}
        >
          {/* <AutoImage source={img_playjumpright} style={{ width: 30, height: 30 }} /> */}
          <AntDesign name="right" size={30} color={color.text} />
          <Text style={HANDLE_TEXT}>30</Text>
        </Pressable>
        <Pressable
          disabled={!nextTrack}
          accessible={true}
          accessibilityLabel={`Nächstes Stück abspielen ${nextTrack?.name}`}
          accessibilityRole="button"
          onPress={onPlayNextTrack}
          style={HANDLE}
        >
          <AntDesign name="stepforward" size={30} color={color.text} />
        </Pressable>
      </View>
      <View style={ROW}>
        <Text
          accessible={true}
          accessibilityLabel={conertToAudioTimePhrase(
            playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0,
          )}
          accessibilityHint="Spielzeit"
          accessibilityRole="text"
          style={TEXT}
        >
          {conertToAudioTimeString(playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0)}
        </Text>
        <Slider
          disabled
          accessible={true}
          accessibilityLabel={`
              ${
                playbackStatus?.isLoaded
                  ? Math.round(
                      (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100,
                    )
                  : 0
              }%
            `}
          accessibilityHint="prozentuale Spielzeit"
          accessibilityRole="progressbar"
          value={playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0}
          maximumValue={playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0}
          maximumTrackTintColor="gray"
          minimumTrackTintColor={color.text}
          thumbTintColor={color.text}
          style={SLIDER_STYLE}
        />
        <Text
          accessible={true}
          accessibilityLabel={conertToAudioTimePhrase(
            playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0,
          )}
          accessibilityHint="Spieldauer"
          accessibilityRole="text"
          style={TEXT}
        >
          {conertToAudioTimeString(playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0)}
        </Text>
      </View>
      {backgroundMusic && (
        <View style={ROW}>
          <Pressable
            accessible={true}
            accessibilityLabel="Hintergrundmusik leiser machen"
            accessibilityRole="button"
            onPress={decreaseBackgroundMusicVolume}
            style={HANDLE}
          >
            <FontAwesome5 name="volume-down" size={30} color={color.text} />
          </Pressable>
          {backgroundPlaybackStatus?.isLoaded && backgroundPlaybackStatus.isMuted && (
            <Pressable
              accessible={true}
              accessibilityLabel="laut stellen"
              accessibilityRole="button"
              onPress={unmuteBackgroundMusic}
              style={HANDLE}
            >
              <FontAwesome5 name="volume-mute" size={30} color={color.text} />
            </Pressable>
          )}
          {backgroundPlaybackStatus?.isLoaded && !backgroundPlaybackStatus.isMuted && (
            <Pressable
              accessible={true}
              accessibilityLabel="stumm schalten"
              accessibilityRole="button"
              onPress={muteBackgroundMusic}
              style={HANDLE}
            >
              <FontAwesome5 name="volume-off" size={30} color={color.text} />
            </Pressable>
          )}
          <Pressable
            accessible={true}
            accessibilityLabel="Hintergrundmusik lauter machen"
            accessibilityRole="button"
            onPress={increaseBackgroundMusicVolume}
            style={HANDLE}
          >
            <FontAwesome5 name="volume-up" size={30} color={color.text} />
          </Pressable>
        </View>
      )}
      <View style={ROW}>
        <Text>Diese Stunde/Übung/Musik herunterladen oder löschen:</Text>
      </View>
      {/* TODO One download switch needs to tell the other when some track was downloaded. */}
      <View style={ROW}>
        <DownloadSwitch
          tracks={[track]}
          onDownloadComplete={switchSource}
          onDownloadJustAboutToBeDeleted={switchSource}
        />
      </View>
      {tracksToDownload.length >= 2 && (
        <>
          <View style={ROW}>
            <Text>
              Jede Stunde/Übung/Musik dieses/dieser Abschnitts/Playlist herunterladen oder löschen:
            </Text>
          </View>
          <View style={ROW}>
            <DownloadSwitch
              tracks={tracksToDownload}
              onDownloadComplete={switchSource}
              onDownloadJustAboutToBeDeleted={switchSource}
            />
          </View>
        </>
      )}
    </View>
  )
}
