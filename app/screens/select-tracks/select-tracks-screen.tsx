import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { Pressable, View, ViewStyle, TextStyle, SectionList, Button, TextInput } from "react-native"
import { Screen, Text } from "../../components"
import { color, spacing } from "../../theme"
import { useStores } from "../../models"

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
const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}

const poses = [
  {
    title: "Volume 1",
    data: [
      {
        trackId: "volume-1-part-1",
        name: "Volume 1 - Teil 1 - Grundlegende Einführung",
        fileExtension: "mp3",
        md5FileHashValue: "4154d609e7307a3cc31c9ac1e20ea9d0",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%201-Grundlegende%20Einf%C3%BChrung.mp3",
      },
      {
        trackId: "volume-1-part-2",
        name: "Volume 1 - Teil 2 - Regeneratives entlastendes Abendprogramm",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%202-Regeneratives%20entlastendes%20Abendprogramm.mp3",
      },
      {
        trackId: "volume-1-part-3",
        name: "Volume 1 - Teil 3 - Naturklänge zum freien Üben",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%203-Naturkl%C3%A4nge%20zum%20freien%20%C3%9Cben.mp3",
      },
      {
        trackId: "volume-1-part-4",
        name: "Volume 1 - Teil 4 - Langes Yogaprogramm Rückenstärkung und Rückenentlastung",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.1&files=Yoga%20Insights%20Volume%201-Teil%204-Langes%20Yogaprogramm%20R%C3%BCckenst%C3%A4rkung%20und%20R%C3%BCckenentlastung.mp3",
      },
    ],
  },
  {
    title: "Volume 2",
    data: [
      {
        trackId: "volume-2-part-1",
        name: "Volume 2 - Teil 1 - Einführung",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%201-Einf%C3%BChrung.mp3",
      },
      {
        trackId: "volume-2-part-2",
        name: "Volume 2 - Teil 2 - Soforthilfe 1 & 2",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%202-Soforthilfe%201%262.mp3",
      },
      {
        trackId: "volume-2-part-3",
        name: "Volume 2 - Teil 3 - Musik pur",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%203-Musik%20pur.mp3",
      },
      {
        trackId: "volume-2-part-4",
        name: "Volume 2 - Teil 4 - Anleitung ohne Musik",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%204-Anleitung%20ohne%20Musik.mp3",
      },
      {
        trackId: "volume-2-part-5",
        name: "Volume 2 - Teil 5 - Ausführliches Übungsprogramm",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%205-Ausf%C3%BChrliches%20%C3%9Cbungsprogramm.mp3",
      },
      {
        trackId: "volume-2-part-6",
        name: "Volume 2 - Teil 6 - Naturklänge",
        fileExtension: "mp3",
        md5FileHashValue: "?",
        webUri:
          "https://citysoundstudio.de/n/index.php/s/WggwKH5eGSxzZbk/download?path=%2FYoga%20Insights%20Vol.2&files=Yoga%20Insights%20Volume%202-Teil%206-Naturkl%C3%A4nge.mp3",
      },
    ],
  },
]

export const SelectTracksScreen = observer(function SelectTracksScreen() {
  const { playlistStore } = useStores()

  const [selection, setSelection] = useState(new Set<string>())
  const [name, setName] = useState("")

  const toggleTrackSelection = (trackId: string) => {
    const newSet = new Set(selection)
    if (selection.has(trackId)) {
      newSet.delete(trackId)
    } else {
      newSet.add(trackId)
    }
    setSelection(newSet)
  }

  const createPlaylist = () => {
    playlistStore.addPlaylist({ name: name, trackIds: Array.from(selection) })
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={poses}
        keyExtractor={(item) => item.trackId}
        renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleTrackSelection(item.trackId)}>
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
      <TextInput accessibilityLabel="Name" value={name} onChangeText={setName} />
      <Button onPress={createPlaylist} title="Create Playlist" />
    </Screen>
  )
})
