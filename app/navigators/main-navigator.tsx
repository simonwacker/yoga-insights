/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import {
  ClassesScreen,
  MusicScreen,
  NamePlaylistScreen,
  OrderPosesScreen,
  PlayerScreen,
  PlaylistsScreen,
  PosesScreen,
  SelectMusicScreen,
  SelectPosesScreen,
  SettingsScreen,
} from "../screens"
import { CompositeNavigationProp, NavigatorScreenParams, RouteProp } from "@react-navigation/native"
import { palette } from "../theme/palette"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`.
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

export type MainParamList = {
  tabs: NavigatorScreenParams<TabParamList>
  player: {
    initialTrackIndex: number
    trackIds: readonly string[]
    backgroundMusicId: string | null
  }
  selectPoses: undefined
  orderPoses: {
    poseIds: readonly string[]
  }
  selectMusic: {
    poseIds: string[]
  }
  namePlaylist: {
    poseIds: string[]
    musicId: string | null
  }
}

export type ClassesScreenRouteProp = RouteProp<TabParamList, "classes">
export type ClassesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "classes">,
  StackNavigationProp<MainParamList>
>

export type PosesScreenRouteProp = RouteProp<TabParamList, "poses">
export type PosesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "poses">,
  StackNavigationProp<MainParamList>
>

export type MusicScreenRouteProp = RouteProp<TabParamList, "music">
export type MusicScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "music">,
  StackNavigationProp<MainParamList>
>

export type PlaylistsScreenRouteProp = RouteProp<TabParamList, "playlists">
export type PlaylistsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "playlists">,
  StackNavigationProp<MainParamList>
>

export type SettingsScreenRouteProp = RouteProp<TabParamList, "settings">
export type SettingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "settings">,
  StackNavigationProp<MainParamList>
>

export type PlayerScreenRouteProp = RouteProp<MainParamList, "player">
export type PlayerScreenNavigationProp = StackNavigationProp<MainParamList, "player">

export type SelectPosesScreenRouteProp = RouteProp<MainParamList, "selectPoses">
export type SelectPosesScreenNavigationProp = StackNavigationProp<MainParamList, "selectPoses">

export type OrderPosesScreenRouteProp = RouteProp<MainParamList, "orderPoses">
export type OrderPosesScreenNavigationProp = StackNavigationProp<MainParamList, "orderPoses">

export type SelectMusicScreenRouteProp = RouteProp<MainParamList, "selectMusic">
export type SelectMusicScreenNavigationProp = StackNavigationProp<MainParamList, "selectMusic">

export type NamePlaylistScreenRouteProp = RouteProp<MainParamList, "namePlaylist">
export type NamePlaylistScreenNavigationProp = StackNavigationProp<MainParamList, "namePlaylist">

const Stack = createStackNavigator<MainParamList>()

// Documentation: https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator<TabParamList>()

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="classes"
      screenOptions={{
        tabBarActiveTintColor: palette.white,
        tabBarInactiveTintColor: palette.black,
        tabBarActiveBackgroundColor: palette.black,
        tabBarInactiveBackgroundColor: palette.white,
      }}
    >
      <Tab.Screen name="classes" component={ClassesScreen} options={{ title: "Stunden" }} />
      <Tab.Screen name="poses" component={PosesScreen} options={{ title: "Übungen" }} />
      <Tab.Screen name="music" component={MusicScreen} options={{ title: "Musik" }} />
      <Tab.Screen name="playlists" component={PlaylistsScreen} options={{ title: "Playlists" }} />
      <Tab.Screen name="settings" component={SettingsScreen} options={{ title: "Einstellungen" }} />
    </Tab.Navigator>
  )
}

export function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="tabs">
      <Stack.Screen name="tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="player" component={PlayerScreen} options={{ title: "Player" }} />
      <Stack.Screen
        name="selectPoses"
        component={SelectPosesScreen}
        options={{ title: "Übungen auswählen" }}
      />
      <Stack.Screen
        name="orderPoses"
        component={OrderPosesScreen}
        options={{ title: "Übungen sortieren" }}
      />
      <Stack.Screen
        name="selectMusic"
        component={SelectMusicScreen}
        options={{ title: "Hintergrundmusik auswählen" }}
      />
      <Stack.Screen
        name="namePlaylist"
        component={NamePlaylistScreen}
        options={{ title: "Playlist benennen" }}
      />
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
