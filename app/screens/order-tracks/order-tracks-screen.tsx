import React, { useCallback, useState } from "react"
import { ViewStyle } from "react-native"
import { Button, Screen, FlatList, ListCheckboxItem } from "../../components"
import { OrderTracksScreenNavigationProp, OrderTracksScreenRouteProp } from "../../navigators"
import { useTrackStore } from "../../stores"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.background,
  flex: 1,
}

export type OrderTracksScreenProps = {
  route: OrderTracksScreenRouteProp
  navigation: OrderTracksScreenNavigationProp
}

export function OrderTracksScreen({ route, navigation }: OrderTracksScreenProps) {
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
        data={trackIds}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <ListCheckboxItem
            label={`${getTrack(item).name} (${orderedTrackIds.indexOf(item)})`}
            checked={orderedTrackIds.includes(item)}
            onPress={() => pushOrDeleteTrack(item)}
          />
        )}
      />
      <Button
        onPress={() => navigation.navigate("namePlaylist", { trackIds: orderedTrackIds })}
        title="Playlist benennen"
      />
    </Screen>
  )
}
