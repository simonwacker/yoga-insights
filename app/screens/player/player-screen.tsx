import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Pressable, View, ViewStyle } from "react-native"
import { Screen, AudioPlayer } from "../../components"
import { useRoute } from "@react-navigation/native"
import { color } from "../../theme"
import { PlayerScreenRouteProp } from "../../navigators"
import { AntDesign } from "@expo/vector-icons"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const PlayerScreen = observer(() => {
  const route = useRoute<PlayerScreenRouteProp>()
  const tracks = route.params

  const [trackIndex, setTrackIndex] = useState(0)
  const track = tracks[trackIndex]

  const playPreviousTrack = () => {
    if (trackIndex > 0) {
      setTrackIndex(trackIndex - 1)
    }
  }

  const playNextTrack = () => {
    if (trackIndex + 1 < tracks.length) {
      setTrackIndex(trackIndex + 1)
    }
  }

  return (
    <Screen style={ROOT} preset="scroll">
      <AudioPlayer
        trackId={track.trackId}
        name={track.name}
        fileExtension={track.fileExtension}
        md5FileHashValue={track.md5FileHashValue}
        webUri={track.webUri}
        onPlaybackDidJustFinish={playNextTrack}
      />
      {tracks.length >= 2 && (
        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 15 }}>
          <Pressable
            disabled={trackIndex === 0}
            accessible={true}
            accessibilityLabel="Vorheriges Stück abspielen"
            accessibilityRole="button"
            onPress={playPreviousTrack}
            style={{ justifyContent: "center" }}
          >
            <AntDesign name="doubleleft" size={30} color="white" />
          </Pressable>
          <Pressable
            disabled={trackIndex + 1 >= tracks.length}
            accessible={true}
            accessibilityLabel="Nächstes Stück abspielen"
            accessibilityRole="button"
            onPress={playNextTrack}
            style={{ justifyContent: "center" }}
          >
            <AntDesign name="doubleright" size={30} color="white" />
          </Pressable>
        </View>
      )}
    </Screen>
  )
})
