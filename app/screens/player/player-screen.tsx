// Inspired by https://rossbulat.medium.com/react-native-how-to-load-and-play-audio-241808f97f61

import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Pressable, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { useRoute } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { Audio, AVPlaybackStatus } from "expo-av"
import Slider from "@react-native-community/slider"
import { PlayerScreenRouteProp } from "../../navigators"
// import { AutoImage } from "../../components"
import { AntDesign } from "@expo/vector-icons"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

const uris = {
  a:
    "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
  b: "fail",
  c: "",
  d:
    "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%202-Regeneratives%20entlastendes%20Abendprogramm.mp3",
}

export const PlayerScreen = observer(() => {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const route = useRoute<PlayerScreenRouteProp>()
  const { trackId } = route.params

  const [sound, setSound] = useState<Audio.Sound | undefined>()
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | undefined>()
  const [editingSlider, setEditingSlider] = useState(false)

  const onPlaybackStatusUpdate = (newPlaybackStatus: AVPlaybackStatus) => {
    setPlaybackStatus(newPlaybackStatus)
  }

  useEffect(() => {
    createAndLoadAndPlay()
  }, [trackId])

  useEffect(() => {
    return sound
      ? () => {
          sound.setOnPlaybackStatusUpdate(() => {})
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  const onStartEditSlider = () => {
    setEditingSlider(true)
  }
  const onEndEditSlider = () => {
    setEditingSlider(false)
  }
  const onEditingSlider = async (seconds) => {
    try {
      const milliseconds = seconds * 1000
      if (playbackStatus.isLoaded) {
        if (milliseconds <= playbackStatus.playableDurationMillis) {
          await sound?.setPositionAsync(milliseconds)
        }
      }
    } catch (error) {
      console.error(`Failed to slide to ${seconds} seconds.`, errors)
    }
  }

  const createAndLoadAndPlay = async () => {
    try {
      const { sound: newSound, status: newPlaybackStatus } = await Audio.Sound.createAsync(
        { uri: uris[trackId] },
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
      if (playbackStatus?.isLoaded && playbackStatus.isPlaying) {
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
    const hours = Math.round(milliseconds / (1000 * 60 * 60))
    const minutes = Math.round((milliseconds / (1000 * 60)) % 60)
    const seconds = Math.round((milliseconds / 1000) % 60)
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}>
        {/* <AutoImage
          source={img_speaker}
          style={{ width: 150, height: 150, marginBottom: 15, alignSelf: "center" }}
        /> */}
        {!playbackStatus?.isLoaded && playbackStatus?.error && (
          <>
            <Text>Error: {playbackStatus.error}</Text>
          </>
        )}
        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 15 }}>
          <Pressable onPress={jumpPrev30Seconds} style={{ justifyContent: "center" }}>
            <AntDesign name="left" size={30} color="white" />
            {/* <AutoImage source={img_playjumpleft} style={{ width: 30, height: 30 }} /> */}
            <Text style={{ color: "white", fontSize: 12 }}>30</Text>
          </Pressable>
          {!playbackStatus?.isLoaded && (
            <AntDesign name="loading1" size={30} color="white" style={{ marginHorizontal: 20 }} />
          )}
          {playbackStatus?.isLoaded && !playbackStatus.isPlaying && (
            <Pressable onPress={play} style={{ marginHorizontal: 20 }}>
              <AntDesign name="playcircleo" size={30} color="white" />
              {/* <AutoImage source={img_play} style={{ width: 30, height: 30 }} /> */}
            </Pressable>
          )}
          {playbackStatus?.isLoaded && playbackStatus.isPlaying && (
            <Pressable onPress={pause} style={{ marginHorizontal: 20 }}>
              <AntDesign name="pausecircleo" size={30} color="white" />
              {/* <AutoImage source={img_pause} style={{ width: 30, height: 30 }} /> */}
            </Pressable>
          )}
          <Pressable onPress={jumpNext30Seconds} style={{ justifyContent: "center" }}>
            {/* <AutoImage source={img_playjumpright} style={{ width: 30, height: 30 }} /> */}
            <AntDesign name="right" size={30} color="white" />
            <Text style={{ color: "white", fontSize: 12 }}>30</Text>
          </Pressable>
        </View>
        <View style={{ marginVertical: 15, marginHorizontal: 15, flexDirection: "row" }}>
          <Text style={{ color: "white", alignSelf: "center" }}>
            {playbackStatus?.isLoaded ? conertToAudioTimeString(playbackStatus.positionMillis) : ""}
          </Text>
          <Slider
            onTouchStart={onStartEditSlider}
            // onTouchMove={() => console.log('onTouchMove')}
            onTouchEnd={onEndEditSlider}
            // onTouchEndCapture={() => console.log('onTouchEndCapture')}
            // onTouchCancel={() => console.log('onTouchCancel')}
            onValueChange={onEditingSlider}
            value={playbackStatus?.isLoaded ? Math.round(playbackStatus.positionMillis / 1000) : 0}
            maximumValue={
              playbackStatus?.isLoaded ? Math.round(playbackStatus.durationMillis / 1000) : 0
            }
            maximumTrackTintColor="gray"
            minimumTrackTintColor="white"
            thumbTintColor="white"
            style={{ flex: 1, alignSelf: "center", marginHorizontal: 10 }}
          />
          <Text style={{ color: "white", alignSelf: "center" }}>
            {playbackStatus?.isLoaded ? conertToAudioTimeString(playbackStatus.durationMillis) : ""}
          </Text>
        </View>
      </View>
    </Screen>
  )
})
