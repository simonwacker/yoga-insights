import React, { useCallback } from "react"
import { Button, Screen, ListButtonItem, FlatList } from "../../components"
import { PlaylistsScreenNavigationProp, PlaylistsScreenRouteProp } from "../../navigators"
import { usePlaylistStore } from "../../stores"

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
            onPress={() =>
              navigation.navigate("player", {
                initialTrackIndex: 0,
                trackIds: item.poseIds,
                backgroundMusicId: item.musicId,
              })
            }
          />
        )}
      />
      <Button title="Neue Playlist" onPress={newPlaylist} />
    </Screen>
  )
}
