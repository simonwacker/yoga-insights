import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { Screen, TrackList } from "../../components"
import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}

export const PosesScreen = observer(function PosesScreen() {
  const { trackStore } = useStores()

  useEffect(() => {
    async function fetchPoses() {
      await trackStore.fetchPoses()
    }

    fetchPoses()
  }, [])

  return (
    <Screen style={ROOT} preset="fixed">
      <TrackList tracks={[...trackStore.poses]} />
    </Screen>
  )
})
