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
  OrderTracksScreen,
  PlayerScreen,
  PlaylistsScreen,
  PosesScreen,
  SelectTracksScreen,
  SettingsScreen,
} from "../screens"
import { CompositeNavigationProp, NavigatorScreenParams, RouteProp } from "@react-navigation/native"
import { Track } from "../models"

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
  }
  selectTracks: undefined
  orderTracks: {
    trackIds: readonly string[]
  }
  namePlaylist: {
    trackIds: string[]
  }
}

export type ClassesScreenRouteProp = RouteProp<TabParamList, "classes">
export type ClassesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "classes">,
  StackNavigationProp<MainParamList>
>
export type ClassesProps = {
  route: ClassesScreenRouteProp
  navigation: ClassesScreenNavigationProp
}

export type PosesScreenRouteProp = RouteProp<TabParamList, "poses">
export type PosesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "poses">,
  StackNavigationProp<MainParamList>
>
export type PosesProps = {
  route: PosesScreenRouteProp
  navigation: PosesScreenNavigationProp
}

export type MusicScreenRouteProp = RouteProp<TabParamList, "music">
export type MusicScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "music">,
  StackNavigationProp<MainParamList>
>
export type MusicProps = {
  route: MusicScreenRouteProp
  navigation: MusicScreenNavigationProp
}

export type PlaylistsScreenRouteProp = RouteProp<TabParamList, "playlists">
export type PlaylistsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "playlists">,
  StackNavigationProp<MainParamList>
>
export type PlaylistsProps = {
  route: PlaylistsScreenRouteProp
  navigation: PlaylistsScreenNavigationProp
}

export type SettingsScreenRouteProp = RouteProp<TabParamList, "settings">
export type SettingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "settings">,
  StackNavigationProp<MainParamList>
>
export type SettingsProps = {
  route: SettingsScreenRouteProp
  navigation: SettingsScreenNavigationProp
}

export type PlayerScreenRouteProp = RouteProp<MainParamList, "player">
export type PlayerScreenNavigationProp = StackNavigationProp<MainParamList, "player">
export type PlayerProps = {
  route: PlayerScreenRouteProp
  navigation: PlayerScreenNavigationProp
}

export type SelectTracksScreenRouteProp = RouteProp<MainParamList, "orderTracks">
export type SelectTracksScreenNavigationProp = StackNavigationProp<MainParamList, "orderTracks">
export type SelectTracksProps = {
  route: SelectTracksScreenRouteProp
  navigation: SelectTracksScreenNavigationProp
}

export type OrderTracksScreenRouteProp = RouteProp<MainParamList, "orderTracks">
export type OrderTracksScreenNavigationProp = StackNavigationProp<MainParamList, "orderTracks">
export type OrderTracksProps = {
  route: OrderTracksScreenRouteProp
  navigation: OrderTracksScreenNavigationProp
}

export type NamePlaylistScreenRouteProp = RouteProp<MainParamList, "namePlaylist">
export type NamePlaylistScreenNavigationProp = StackNavigationProp<MainParamList, "namePlaylist">
export type NamePlaylistProps = {
  route: NamePlaylistScreenRouteProp
  navigation: NamePlaylistScreenNavigationProp
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
        name="selectTracks"
        component={SelectTracksScreen}
        options={{ title: "Übungen auswählen" }}
      />
      <Stack.Screen
        name="orderTracks"
        component={OrderTracksScreen}
        options={{ title: "Übungen sortieren" }}
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
