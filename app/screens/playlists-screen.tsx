import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useCallback, useEffect, useState } from "react"
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

  const setNavigateMode = useCallback(() => {
    setMode({ type: "NAVIGATE" })
    navigation.getParent()?.setOptions({ headerShown: false, headerRight: undefined })
  }, [navigation])
  // We do not specify `setMode` in the dependency list because "React
  // guarantees that setState function identity is stable and won’t change on
  // re-renders. This is why it’s safe to omit from the useEffect or useCallback
  // dependency list.", see
  // https://reactjs.org/docs/hooks-reference.html#usestate

  const setSelectMode = (selectedPlaylistIds: Set<number>) => {
    setMode({ type: "SELECT", selectedPlaylistIds: selectedPlaylistIds })
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
  }

  useEffect(() => {
    // const unsubscribe = navigation.getParent().addListener("tabPress", () => {
    const unsubscribe = navigation.addListener("blur", () => {
      setNavigateMode()
    })
    return unsubscribe
  }, [navigation, setNavigateMode])

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

  const newPlaylist = () => navigation.navigate("selectPoses", {})

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
      playlistId: item.playlistId,
    })

  const toggleSelection = (item: Playlist) => {
    if (mode.type === "SELECT") {
      const copy = new Set(mode.selectedPlaylistIds)
      if (copy.has(item.playlistId)) {
        copy.delete(item.playlistId)
      } else {
        copy.add(item.playlistId)
      }
      setSelectMode(copy)
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
              onLongPress={() => setSelectMode(new Set([item.playlistId]))}
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
