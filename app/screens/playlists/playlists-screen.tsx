import React, { useCallback } from "react"
import { FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text, TrackListButtonItem } from "../../components"
import { color, spacing } from "../../theme"
import { PlaylistsScreenNavigationProp, PlaylistsScreenRouteProp } from "../../navigators"
import { usePlaylistStore, useTrackStore } from "../../stores"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
const FLAT_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

export type PlaylistsScreenProps = {
  route: PlaylistsScreenRouteProp
  navigation: PlaylistsScreenNavigationProp
}

export const PlaylistsScreen = ({ navigation }: PlaylistsScreenProps) => {
  const playlists = usePlaylistStore(useCallback((state) => state.playlists, []))

  return (
    <Screen style={ROOT} preset="fixed">
      <FlatList
        contentContainerStyle={FLAT_LIST}
        data={playlists}
        keyExtractor={(item) => item.playlistId.toString()}
        renderItem={({ item }) => (
          <TrackListButtonItem
            label={item.name}
            onPress={() =>
              navigation.navigate("player", {
                initialTrackIndex: 0,
                trackIds: item.trackIds,
              })
            }
          />
        )}
      />
      <Pressable onPress={() => navigation.navigate("selectTracks")}>
        <Text>Neue Playlist</Text>
      </Pressable>
    </Screen>
  )
}
