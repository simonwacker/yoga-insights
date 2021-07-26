import React from "react"
import { FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { PlayerScreenNavigationProp } from "../../navigators"
import { usePlaylistStore, usePoseStore } from "../../stores"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: 10,
}
const LIST_TEXT: TextStyle = {
  marginLeft: 10,
}
const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

export const PlaylistsScreen = () => {
  const { playlists } = usePlaylistStore()
  const { poses } = usePoseStore()

  const navigation = useNavigation<PlayerScreenNavigationProp>()

  return (
    <Screen style={ROOT} preset="fixed">
      <FlatList
        contentContainerStyle={FLAT_LIST}
        data={playlists}
        keyExtractor={(index) => index.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("player", {
                initialTrackIndex: 0,
                tracks: item.trackIds.map((trackId) => poses.indexedById[trackId]),
              })
            }
          >
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  )
}
