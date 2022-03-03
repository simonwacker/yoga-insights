import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useCallback } from "react"
import { ViewStyle } from "react-native"
import { FAB } from "react-native-paper"
import { Screen, ListButtonItem, FlatList } from "../components"
import { SectionKind, TrackKind } from "../models"
import { PlaylistsScreenNavigationProp, PlaylistsScreenRouteProp } from "../navigators"
import { usePlaylistStore } from "../stores"

const FAB_STYLE: ViewStyle = {
  position: "absolute",
  margin: 16,
  right: 0,
  bottom: 0,
}

export type PlaylistsScreenProps = {
  route: PlaylistsScreenRouteProp
  navigation: PlaylistsScreenNavigationProp
}

export function PlaylistsScreen({ navigation }: PlaylistsScreenProps) {
  const playlists = usePlaylistStore(useCallback((state) => state.playlists, []))

  const newPlaylist = () => navigation.navigate("selectPoses")

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack} onMagicTap={newPlaylist}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.playlistId.toString()}
        renderItem={({ item }) => (
          <ListButtonItem
            label={item.name}
            description={null}
            onPress={() =>
              navigation.navigate("player", {
                section: {
                  title: item.name,
                  kind: SectionKind.Playlist,
                  trackKind: TrackKind.Pose,
                  data: [...item.poseIds],
                },
                initialTrackIndex: 0,
                backgroundMusicId: item.musicId,
              })
            }
          />
        )}
      />
      <FAB
        label="Neue Playlist"
        icon={(props) => <MaterialCommunityIcons name="plus" {...props} />}
        onPress={newPlaylist}
        style={FAB_STYLE}
      />
    </Screen>
  )
}
