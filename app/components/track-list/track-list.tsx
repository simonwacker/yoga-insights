import * as React from "react"
import { SectionList, Pressable, StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { spacing } from "../../theme"
import { Text } from "../"
import { flatten } from "ramda"
import { useNavigation } from "@react-navigation/native"
import { ClassesScreenNavigationProp } from "../../navigators"
import { Section, Track } from "../../models"
import { useTrackStore } from "../../stores"
import { useCallback } from "react"

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
  sections: Section[]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export const TrackList = ({ sections, style }: TrackListProps) => {
  const navigation = useNavigation<ClassesScreenNavigationProp>()
  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))

  return (
    <View style={flatten([CONTAINER, style])}>
      <SectionList
        contentContainerStyle={SECTION_LIST}
        sections={sections}
        keyExtractor={(item) => item}
        renderSectionHeader={({ section }) => <Text style={SECTION_TITLE}>{section.title}</Text>}
        renderItem={({ item, index, section }) => (
          <Pressable
            onPress={() =>
              navigation.navigate("player", {
                initialTrackIndex: index,
                trackIds: section.data,
              })
            }
          >
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>{getTrack(item).name}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}
