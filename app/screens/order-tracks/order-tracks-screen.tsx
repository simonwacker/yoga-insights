import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { Button, FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { OrderTracksScreenNavigationProp, OrderTracksScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color, spacing } from "../../theme"

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

export const OrderTracksScreen = () => {
  const navigation = useNavigation<OrderTracksScreenNavigationProp>()
  const route = useRoute<OrderTracksScreenRouteProp>()
  const { trackIds } = route.params

  const getTrack = useTrackStore(useCallback((state) => state.getTrack, []))
  const [orderedTrackIds, setOrderedTrackIds] = useState(new Array<string>())

  const pushOrDeleteTrack = (trackId: string) => {
    const copy = [...orderedTrackIds]
    const index = copy.indexOf(trackId)
    if (index === -1) {
      copy.push(trackId)
    } else {
      copy.splice(index, 1)
    }
    setOrderedTrackIds(copy)
  }

  return (
    <Screen style={ROOT} preset="fixed">
      <FlatList
        contentContainerStyle={FLAT_LIST}
        data={trackIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable onPress={() => pushOrDeleteTrack(item)}>
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>
                {getTrack(item).name} {orderedTrackIds.indexOf(item)}
              </Text>
            </View>
          </Pressable>
        )}
      />
      <Button
        onPress={() => navigation.navigate("namePlaylist", { trackIds: orderedTrackIds })}
        title="Playlist benennen"
      />
    </Screen>
  )
}
