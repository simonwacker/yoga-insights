import React, { useCallback, useState } from "react"
import { Button, Screen, TextField } from "../components"
import { NamePlaylistScreenNavigationProp, NamePlaylistScreenRouteProp } from "../navigators"
import { usePlaylistStore } from "../stores"

export type NamePlaylistScreenProps = {
  route: NamePlaylistScreenRouteProp
  navigation: NamePlaylistScreenNavigationProp
}

export function NamePlaylistScreen({ route, navigation }: NamePlaylistScreenProps) {
  const { poseIds, musicId, playlistId } = route.params

  const addPlaylist = usePlaylistStore(useCallback((state) => state.addPlaylist, []))
  const updatePlaylist = usePlaylistStore(useCallback((state) => state.updatePlaylist, []))
  const getPlaylist = usePlaylistStore(useCallback((state) => state.getPlaylist, []))
  const playlist = playlistId === undefined ? null : getPlaylist(playlistId)
  const [name, setName] = useState(() => playlist?.name ?? "")

  const canFinish = name !== ""

  const finish = () => {
    if (canFinish) {
      if (playlistId === undefined || playlist === null) {
        addPlaylist({ name: name, poseIds: poseIds, musicId: musicId })
        navigation.navigate("tabs", { screen: "playlists" })
      } else {
        updatePlaylist(playlistId, { name: name, poseIds: poseIds, musicId: musicId })
        navigation.navigate("tabs", { screen: "playlists" })
        // We do not jump to the player here because it can result in the error
        // that download switch rendered more or less hooks than previously when
        // poses are added or removed.
        // ---
        // navigation.navigate("player", {
        //   section: {
        //     title: name,
        //     kind: SectionKind.Playlist,
        //     trackKind: TrackKind.Pose,
        //     data: poseIds,
        //   },
        //   initialTrackIndex: 0,
        //   backgroundMusicId: musicId,
        //   playlistId: playlistId,
        // })
      }
    }
  }

  return (
    <Screen preset="scroll" onAccessibilityEscape={navigation.goBack} onMagicTap={finish}>
      <TextField
        accessibilityLabel="Name"
        value={name}
        onChangeText={setName}
        onMagicTap={finish}
        label="Name"
      />
      <Button
        disabled={!canFinish}
        onPress={finish}
        title={`Playlist ${playlistId === undefined ? "erstellen" : "speichern"}`}
      />
    </Screen>
  )
}
