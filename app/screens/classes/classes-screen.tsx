import React from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, FlatList, View, Image, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
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

export const ClassesScreen = observer(function ClassesScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  const navigation = useNavigation()

  const classes = [
    {id: 1, name: "Spannungsausgleich", status: "gekauft/heruntergeladen"},
    {id: 2, name: "Migraeneprophylaxe", status: "gekauft"},
    {id: 3, name: "Gesunder Ruecken", status: "kaufbar"},
    {id: 4, name: "Flexible Beine", status: "kaufbar"}
  ]

  return (
    <Screen style={ROOT} preset="scroll">
      <FlatList
        contentContainerStyle={FLAT_LIST}
        data={[...classes]}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate("player")}>
            <View style={LIST_CONTAINER}>
              <Text style={LIST_TEXT}>
                {item.name} ({item.status})
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  )
})
