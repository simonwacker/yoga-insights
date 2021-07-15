/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  ClassesScreen,
  MusicScreen,
  PlayerScreen,
  PlaylistsScreen,
  PosesScreen,
  SettingsScreen,
} from "../screens"
import { RouteProp } from "@react-navigation/native"

export type MainParamList = {
  tabs: undefined
  // TODO Restrict extension and URL type!
  player: {
    trackId: string
    name: string
    fileExtension: string
    md5FileHashValue: string
    webUri: string
  }
}

export type PlayerScreenRouteProp = RouteProp<MainParamList, "player">

export type PlayerScreenNavigationProp = StackNavigationProp<MainParamList, "player">

export type PlayerProps = {
  route: PlayerScreenRouteProp
  navigation: PlayerScreenNavigationProp
}

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type TabParamList = {
  classes: undefined
  poses: undefined
  music: undefined
  playlists: undefined
  settings: undefined
}

const Stack = createStackNavigator<MainParamList>()

// Documentation: https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator<TabParamList>()

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="classes"
      tabBarOptions={
        {
          // activeTintColor: "#fc9d61",
          // inactiveTintColor: "#fc9d61",
          // activeBackgroundColor: "#e6a1ff",
          // inactiveBackgroundColor: "#f2ccff",
        }
      }
    >
      <Tab.Screen name="classes" component={ClassesScreen} options={{ title: "Stunden" }} />
      <Tab.Screen name="poses" component={PosesScreen} options={{ title: "Übungen" }} />
      <Tab.Screen name="music" component={MusicScreen} options={{ title: "Musik" }} />
      <Tab.Screen name="playlists" component={PlaylistsScreen} options={{ title: "Favoriten" }} />
      <Tab.Screen name="settings" component={SettingsScreen} options={{ title: "Einstellungen" }} />
    </Tab.Navigator>
  )
}

export function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="tabs">
      <Stack.Screen name="tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="player" component={PlayerScreen} options={{ title: "Player" }} />
    </Stack.Navigator>
  )
}

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["classes"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
