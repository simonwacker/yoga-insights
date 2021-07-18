// Inspired by https://rossbulat.medium.com/react-native-how-to-load-and-play-audio-241808f97f61

import React, { useEffect, useState } from "react"
import { Pressable, View } from "react-native"
import { Text, DownloadSwitch } from "../../components"
import { Audio, AVPlaybackStatus } from "expo-av"
import Slider from "@react-native-community/slider"
import { AntDesign } from "@expo/vector-icons"
import { FileSystem } from "react-native-unimodules"
import { AudioPlayerProps } from "./audio-player.props"

export function AudioPlayer({
  trackId,
  name,
  fileExtension,
  md5FileHashValue,
  webUri,
  onPlaybackDidJustFinish,
}: AudioPlayerProps) {
  // TODO Find a better way to come up with a file URI.
  const fileUri = `${FileSystem.documentDirectory}${trackId}.${fileExtension}`

  const [sound, setSound] = useState<Audio.Sound | undefined>()
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | undefined>()

  const onPlaybackStatusUpdate = (newPlaybackStatus: AVPlaybackStatus) => {
    setPlaybackStatus(newPlaybackStatus)
    if (newPlaybackStatus.isLoaded && newPlaybackStatus.didJustFinish) {
      onPlaybackDidJustFinish()
    }
  }

  useEffect(() => {
    createAndLoadAndPlay()
  }, [fileUri, webUri])

  useEffect(() => {
    return sound
      ? () => {
          sound.setOnPlaybackStatusUpdate(() => {})
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const createAndLoadAndPlay = async () => {
    try {
      if (sound) {
        sound.setOnPlaybackStatusUpdate(() => {})
        await sound.unloadAsync()
      }
      // Make sure audio is played if iOS is in silent mode, defaults to `false`.
      // NOTE: This sets the property globally which means _all_ future audio
      // playbacks will be affected.
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true })
      const { exists } = await FileSystem.getInfoAsync(fileUri)
      const uri = exists ? fileUri : webUri
      const { sound: newSound, status: newPlaybackStatus } = await Audio.Sound.createAsync(
        { uri: uri },
        { shouldPlay: true }, // initialStatus
        onPlaybackStatusUpdate, // onPlaybackStatusUpdate
        true, // downloadFirst
      )
      setSound(newSound)
      onPlaybackStatusUpdate(newPlaybackStatus)
    } catch (error) {
      console.error("Failed to create, load, and play audio.", error)
    }
  }

  const play = async () => {
    try {
      if (playbackStatus?.isLoaded) {
        await sound?.playAsync()
      }
    } catch (error) {
      console.error("Failed to play audio.", error)
    }
  }

  const pause = async () => {
    try {
      if (playbackStatus?.isLoaded && playbackStatus.shouldPlay) {
        await sound?.pauseAsync()
      }
    } catch (error) {
      console.error("Failed to pause audio.", error)
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
        await sound?.setPositionAsync(nextMilliseconds)
      }
    } catch (error) {
      console.error(`Failed to jump ${seconds} seconds.`, error)
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

  const switchSource = async (uri: string) => {
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

  return (
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
      {/* <AutoImage
          source={img_speaker}
          style={{ width: 150, height: 150, marginBottom: 15, alignSelf: "center" }}
        /> */}
      {!playbackStatus?.isLoaded && playbackStatus?.error && (
        <View style={{ marginVertical: 15 }}>
          <Text style={{ textAlign: "center" }}>Error: {playbackStatus.error}</Text>
        </View>
      )}
      <View style={{ marginVertical: 15 }}>
        <Text style={{ textAlign: "center" }}>{name}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 15,
          marginHorizontal: 15,
        }}
      >
        <Pressable
          accessible={true}
          accessibilityLabel="30 Sekunden zurückspulen"
          accessibilityRole="button"
          onPress={jumpPrev30Seconds}
          style={{ justifyContent: "center" }}
        >
          <AntDesign name="left" size={30} color="white" />
          {/* <AutoImage source={img_playjumpleft} style={{ width: 30, height: 30 }} /> */}
          <Text style={{ color: "white", fontSize: 12 }}>30</Text>
        </Pressable>
        {!playbackStatus?.isLoaded && (
          <AntDesign
            accessible={true}
            accessibilityLabel="wird geladen"
            accessibilityRole="text"
            name="loading1"
            size={30}
            color="white"
            style={{ marginHorizontal: 20 }}
          />
        )}
        {playbackStatus?.isLoaded && !playbackStatus.shouldPlay && (
          <Pressable
            accessible={true}
            accessibilityLabel="abspielen"
            accessibilityRole="button"
            onPress={play}
            style={{ marginHorizontal: 20 }}
          >
            <AntDesign name="playcircleo" size={30} color="white" />
            {/* <AutoImage source={img_play} style={{ width: 30, height: 30 }} /> */}
          </Pressable>
        )}
        {playbackStatus?.isLoaded && playbackStatus.shouldPlay && (
          <Pressable
            accessible={true}
            accessibilityLabel="pausieren"
            accessibilityRole="button"
            onPress={pause}
            style={{ marginHorizontal: 20 }}
          >
            <AntDesign name="pausecircleo" size={30} color="white" />
            {/* <AutoImage source={img_pause} style={{ width: 30, height: 30 }} /> */}
          </Pressable>
        )}
        <Pressable
          accessible={true}
          accessibilityLabel="30 Sekunden vorspulen"
          accessibilityRole="button"
          onPress={jumpNext30Seconds}
          style={{ justifyContent: "center" }}
        >
          {/* <AutoImage source={img_playjumpright} style={{ width: 30, height: 30 }} /> */}
          <AntDesign name="right" size={30} color="white" />
          <Text style={{ color: "white", fontSize: 12 }}>30</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 15,
          marginHorizontal: 15,
        }}
      >
        <Text
          accessible={true}
          accessibilityLabel={conertToAudioTimePhrase(
            playbackStatus?.isLoaded ? playbackStatus.positionMillis : 0,
          )}
          accessibilityHint="Spielzeit"
          accessibilityRole="text"
          style={{ color: "white", alignSelf: "center" }}
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
          minimumTrackTintColor="white"
          thumbTintColor="white"
          style={{ flex: 1, alignSelf: "center", marginHorizontal: 10 }}
        />
        <Text
          accessible={true}
          accessibilityLabel={conertToAudioTimePhrase(
            playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0,
          )}
          accessibilityHint="Spieldauer"
          accessibilityRole="text"
          style={{ color: "white", alignSelf: "center" }}
        >
          {conertToAudioTimeString(playbackStatus?.isLoaded ? playbackStatus.durationMillis : 0)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 15,
        }}
      >
        <DownloadSwitch
          trackId={trackId}
          sourceWebUri={webUri}
          targetFileUri={fileUri}
          md5FileHashValue={md5FileHashValue}
          onDownloadComplete={switchSource}
          onDownloadJustAboutToBeDeleted={switchSource}
        />
      </View>
    </View>
  )
}