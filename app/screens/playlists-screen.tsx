import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Appbar, FAB, List } from "react-native-paper"
import { Screen, FlatList } from "../components"
import { Playlist, SectionKind, TrackKind } from "../models"
import { PlaylistsScreenNavigationProp, PlaylistsScreenRouteProp } from "../navigators"
import { usePlaylistStore } from "../stores"

const FAB_STYLE: ViewStyle = {
  position: "absolute",
  margin: 16,
  right: 0,
  bottom: 0,
}

type NavigateMode = {
  type: "NAVIGATE"
}

type SelectMode = {
  type: "SELECT"
  selectedPlaylistIds: Set<number>
}

type Mode = NavigateMode | SelectMode

export type PlaylistsScreenProps = {
  route: PlaylistsScreenRouteProp
  navigation: PlaylistsScreenNavigationProp
}

export function PlaylistsScreen({ navigation }: PlaylistsScreenProps) {
  const playlists = usePlaylistStore(useCallback((state) => state.playlists, []))
  const deletePlaylist = usePlaylistStore(useCallback((state) => state.deletePlaylist, []))

  const [mode, setMode] = useState<Mode>({ type: "NAVIGATE" })

  switch (mode.type) {
    case "NAVIGATE":
      navigation.getParent()?.setOptions({ headerShown: false, headerRight: undefined })
      break
    case "SELECT":
      navigation.getParent()?.setOptions({
        headerShown: true,
        headerRight: (props: any) => (
          <Appbar.Action
            {...props}
            accessibilityLabel="Ausgewählte Playlists löschen"
            accessibilityRole="button"
            accessible={true}
            icon={(props) => <MaterialCommunityIcons name="delete" {...props} />}
            onPress={deleteSelectedPlaylists}
            onMagicTap={deleteSelectedPlaylists}
          />
        ),
      })
      break
  }

  React.useEffect(() => {
    // const unsubscribe = navigation.getParent().addListener("tabPress", () => {
    const unsubscribe = navigation.addListener("blur", () => {
      if (mode.type === "SELECT") {
        setNavigateMode()
      }
    })

    return unsubscribe
  }, [navigation])

  const deleteSelectedPlaylists = () => {
    if (mode.type === "SELECT") {
      for (const playlistId of mode.selectedPlaylistIds) {
        deletePlaylist(playlistId)
      }
      setNavigateMode()
    } else {
      console.warn(`Attempted to delete selected playlists in mode ${mode.type}.`)
    }
  }

  const setNavigateMode = () => {
    setMode({ type: "NAVIGATE" })
  }

  const setSelectMode = (playlist: Playlist) => {
    setMode({ type: "SELECT", selectedPlaylistIds: new Set([playlist.playlistId]) })
  }

  const newPlaylist = () => navigation.navigate("selectPoses")

  const navigateToPlayer = (item: Playlist) =>
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

  const toggleSelection = (item: Playlist) => {
    if (mode.type === "SELECT") {
      const copy = new Set(mode.selectedPlaylistIds)
      if (copy.has(item.playlistId)) {
        copy.delete(item.playlistId)
      } else {
        copy.add(item.playlistId)
      }
      setMode({ type: "SELECT", selectedPlaylistIds: copy })
    } else {
      console.warn(
        `Attempted to toggle selection of playlist ${item.playlistId} in mode ${mode.type}.`,
      )
    }
  }

  return (
    <Screen preset="fixed" onAccessibilityEscape={navigation.goBack} onMagicTap={newPlaylist}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.playlistId.toString()}
        renderItem={({ item }) =>
          // TODO Is setting `onMagicTap` necessary?
          mode.type === "NAVIGATE" ? (
            <List.Item
              title={item.name}
              onLongPress={() => setSelectMode(item)}
              onPress={() => navigateToPlayer(item)}
              onMagicTap={() => navigateToPlayer(item)}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          ) : (
            <List.Item
              title={item.name}
              onLongPress={() => setNavigateMode()}
              accessible={true}
              accessibilityRole="checkbox"
              onPress={() => toggleSelection(item)}
              onMagicTap={() => toggleSelection(item)}
              left={(props) =>
                mode.selectedPlaylistIds.has(item.playlistId) ? (
                  <List.Icon {...props} icon="checkbox-marked-circle" />
                ) : (
                  <List.Icon {...props} icon="checkbox-blank-circle-outline" />
                )
              }
            />
          )
        }
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
