// Inspired by https://rossbulat.medium.com/react-native-how-to-load-and-play-audio-241808f97f61

import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle } from "react-native"
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

  const sound = new Audio.Sound()

  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | undefined>()
  const [editingSlider, setEditingSlider] = useState(false)

  const onPlaybackStatusUpdate = (newPlaybackStatus: AVPlaybackStatus) => {
    setPlaybackStatus(newPlaybackStatus)
  }

  useEffect(() => {
    loadAndPlay()
    return () => sound.unloadAsync()
  }, [trackId])

  const onStartEditSlider = () => {
    setEditingSlider(true)
  }
  const onEndEditSlider = () => {
    setEditingSlider(false)
  }
  const onEditingSlider = (seconds) => {
    const milliseconds = seconds * 1000
    sound.setPositionAsync(milliseconds)
  }

  const loadAndPlay = async () => {
    if (playbackStatus?.isLoaded) {
      await sound.unloadAsync()
    }
    const status = await sound.loadAsync(
      { uri: uris[trackId] },
      { shouldPlay: true }, // initialStatus
      true, // downloadFirst
    )
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    onPlaybackStatusUpdate(status) // TODO Is this necessary?
  }

  const play = () => {
    if (playbackStatus?.isLoaded) {
      sound.playAsync()
    }
  }

  const pause = () => {
    if (playbackStatus?.isLoaded && playbackStatus.isPlaying) {
      sound.pauseAsync()
    }
  }

  const jumpPrev30Seconds = () => jumpSeconds(-30)
  const jumpNext30Seconds = () => jumpSeconds(30)
  const jumpSeconds = async (seconds: number) => {
    if (playbackStatus?.isLoaded) {
      const milliseconds = seconds * 1000
      let nextMilliseconds = playbackStatus.positionMillis + milliseconds
      if (nextMilliseconds < 0) {
        nextMilliseconds = 0
      } else if (nextMilliseconds > playbackStatus.durationMillis) {
        nextMilliseconds = playbackStatus.durationMillis
      }
      sound.setPositionAsync(nextMilliseconds)
    }
  }

  const getAudioTimeString = (milliseconds: number) => {
    const seconds = Math.round(milliseconds / 1000)
    const h = Math.round(seconds / (60 * 60))
    const m = Math.round((seconds % (60 * 60)) / 60)
    const s = Math.round(seconds % 60)

    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s)
  }

  const currentTimeString = playbackStatus?.isLoaded
    ? getAudioTimeString(playbackStatus.positionMillis)
    : ""
  const durationString = playbackStatus?.isLoaded
    ? getAudioTimeString(playbackStatus.playableDurationMillis)
    : ""

  return (
    <Screen style={ROOT} preset="scroll">
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "black" }}>
        {/* <AutoImage
          source={img_speaker}
          style={{ width: 150, height: 150, marginBottom: 15, alignSelf: "center" }}
        /> */}
        <AntDesign name="antdesign" size={150} color="white" />
        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 15 }}>
          <TouchableOpacity onPress={jumpPrev30Seconds} style={{ justifyContent: "center" }}>
            <AntDesign name="left" size={30} color="white" />
            {/* <AutoImage source={img_playjumpleft} style={{ width: 30, height: 30 }} /> */}
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >
              30 L
            </Text>
          </TouchableOpacity>
          {!playbackStatus?.isLoaded && playbackStatus?.error (
            <>
              <Text>Error: {playbackStatus.error}</Text>
            </>
          )}
          {!playbackStatus?.isLoaded && (
            <>
              <Text>Loading ...</Text>
              <AntDesign name="loading1" size={30} color="white" />
            </>
          )}
          {playbackStatus?.isLoaded && playbackStatus.isPlaying && (
            <TouchableOpacity onPress={pause} style={{ marginHorizontal: 20 }}>
              <AntDesign name="pausecircleo" size={30} color="white" />
              {/* <AutoImage source={img_pause} style={{ width: 30, height: 30 }} /> */}
            </TouchableOpacity>
          )}
          {playbackStatus?.isLoaded && !playbackStatus.isPlaying && (
            <TouchableOpacity onPress={play} style={{ marginHorizontal: 20 }}>
              <AntDesign name="playcircleo" size={30} color="white" />
              {/* <AutoImage source={img_play} style={{ width: 30, height: 30 }} /> */}
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={jumpNext30Seconds} style={{ justifyContent: "center" }}>
            {/* <AutoImage source={img_playjumpright} style={{ width: 30, height: 30 }} /> */}
            <AntDesign name="right" size={30} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 12,
              }}
            >
              30 R
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 15, marginHorizontal: 15, flexDirection: "row" }}>
          <Text style={{ color: "white", alignSelf: "center" }}>{currentTimeString}</Text>
          <Slider
            onTouchStart={onStartEditSlider}
            // onTouchMove={() => console.log('onTouchMove')}
            onTouchEnd={onEndEditSlider}
            // onTouchEndCapture={() => console.log('onTouchEndCapture')}
            // onTouchCancel={() => console.log('onTouchCancel')}
            onValueChange={onEditingSlider}
            value={playbackStatus?.isLoaded ? Math.round(playbackStatus.positionMillis / 1000) : 0}
            maximumValue={
              playbackStatus?.isLoaded
                ? Math.round(playbackStatus.playableDurationMillis / 1000)
                : 0
            }
            maximumTrackTintColor="gray"
            minimumTrackTintColor="white"
            thumbTintColor="white"
            style={{ flex: 1, alignSelf: "center", marginHorizontal: 10 }}
          />
          <Text style={{ color: "white", alignSelf: "center" }}>{durationString}</Text>
        </View>
      </View>
    </Screen>
  )
})
