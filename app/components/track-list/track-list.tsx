import * as React from "react"
import { SectionList, Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { spacing } from "../../theme"
import { Text } from "../"
import { flatten } from "ramda"
import { useNavigation } from "@react-navigation/native"
import { PlayerScreenNavigationProp } from "../../navigators"
import { Section, Track } from "../../models"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}
const SECTION_LIST: ViewStyle = {
  paddingHorizontal: spacing[4],
}
const SECTION_TITLE: TextStyle = {
  marginLeft: 10,
}
const LIST_CONTAINER: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  padding: 10,
}
const LIST_TEXT: TextStyle = {
  marginLeft: 10,
}

export interface TrackListProps {
  tracks: Section<Track>[]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const TrackList = ({ tracks, style }: TrackListProps) => {
  const navigation = useNavigation<PlayerScreenNavigationProp>()

  return (
    <View style={flatten([CONTAINER, style])}>
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={tracks}
        keyExtractor={(item) => item.trackId}
        renderSectionHeader={({ section }) => <Text style={SECTION_TITLE}>{section.title}</Text>}
        renderItem={({ item, index, section }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("player", {
                initialTrackIndex: index,
                tracks: [...section.data],
              })
            }
          >
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{item.name}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}
