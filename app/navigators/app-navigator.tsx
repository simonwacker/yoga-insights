/**
 * The app navigator is used for the primary navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot
 * password) and a "main" flow which the user will use once logged in.
 */
import React from "react"
import {
  NavigationContainer,
  NavigatorScreenParams,
  CompositeNavigationProp,
  RouteProp,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackHeaderProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { navigationRef } from "./navigation-utilities"
import {
  MaterialBottomTabNavigationProp,
  createMaterialBottomTabNavigator,
} from "@react-navigation/material-bottom-tabs"
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
import { Appbar } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Section } from "../models"
import { WelcomeScreen } from "../screens/welcome/welcome-screen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type BottomTabParamList = {
  classes: undefined
  poses: undefined
  music: undefined
  playlists: undefined
  settings: undefined
}

export type AppParamList = {
  welcome: undefined
  tabs: NavigatorScreenParams<BottomTabParamList>
  player: {
    section: Section
    initialTrackIndex: number
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

export type WelcomeScreenRouteProp = RouteProp<AppParamList, "welcome">
export type WelcomeScreenNavigationProp = NativeStackNavigationProp<AppParamList, "welcome">

export type ClassesScreenRouteProp = RouteProp<BottomTabParamList, "classes">
export type ClassesScreenNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<BottomTabParamList, "classes">,
  NativeStackNavigationProp<AppParamList>
>

export type PosesScreenRouteProp = RouteProp<BottomTabParamList, "poses">
export type PosesScreenNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<BottomTabParamList, "poses">,
  NativeStackNavigationProp<AppParamList>
>

export type MusicScreenRouteProp = RouteProp<BottomTabParamList, "music">
export type MusicScreenNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<BottomTabParamList, "music">,
  NativeStackNavigationProp<AppParamList>
>

export type PlaylistsScreenRouteProp = RouteProp<BottomTabParamList, "playlists">
export type PlaylistsScreenNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<BottomTabParamList, "playlists">,
  NativeStackNavigationProp<AppParamList>
>

export type SettingsScreenRouteProp = RouteProp<BottomTabParamList, "settings">
export type SettingsScreenNavigationProp = CompositeNavigationProp<
  MaterialBottomTabNavigationProp<BottomTabParamList, "settings">,
  NativeStackNavigationProp<AppParamList>
>

export type TabsScreenRouteProp = RouteProp<AppParamList, "tabs">
export type TabsScreenNavigationProp = NativeStackNavigationProp<AppParamList, "tabs">

export type PlayerScreenRouteProp = RouteProp<AppParamList, "player">
export type PlayerScreenNavigationProp = NativeStackNavigationProp<AppParamList, "player">

export type SelectPosesScreenRouteProp = RouteProp<AppParamList, "selectPoses">
export type SelectPosesScreenNavigationProp = NativeStackNavigationProp<AppParamList, "selectPoses">

export type OrderPosesScreenRouteProp = RouteProp<AppParamList, "orderPoses">
export type OrderPosesScreenNavigationProp = NativeStackNavigationProp<AppParamList, "orderPoses">

export type SelectMusicScreenRouteProp = RouteProp<AppParamList, "selectMusic">
export type SelectMusicScreenNavigationProp = NativeStackNavigationProp<AppParamList, "selectMusic">

export type NamePlaylistScreenRouteProp = RouteProp<AppParamList, "namePlaylist">
export type NamePlaylistScreenNavigationProp = NativeStackNavigationProp<
  AppParamList,
  "namePlaylist"
>

const initialBottomTabRouteName: keyof BottomTabParamList = "classes"

const bottomTabTitles: { [key in keyof BottomTabParamList]: string } = {
  classes: "Stunden",
  poses: "Übungen",
  music: "Musik",
  playlists: "Playlists",
  settings: "Einstellungen",
}

function getBottomTabTitle(route: TabsScreenRouteProp) {
  // If the focused route is not found, we need to assume it's the initial
  // screen This can happen during if there hasn't been any navigation inside
  // the screen
  const maybeRouteName = getFocusedRouteNameFromRoute(route)
  const routeName =
    maybeRouteName != null && maybeRouteName in bottomTabTitles
      ? (maybeRouteName as keyof BottomTabParamList)
      : initialBottomTabRouteName
  return bottomTabTitles[routeName]
}

const AppStack = createNativeStackNavigator<AppParamList>()

// Documentation: https://reactnavigation.org/docs/tab-based-navigation
const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>()

export function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName={initialBottomTabRouteName}>
      <BottomTab.Screen
        name="classes"
        component={ClassesScreen}
        options={{
          title: bottomTabTitles.classes,
          tabBarLabel: bottomTabTitles.classes,
          tabBarIcon: (props) => <MaterialCommunityIcons name="timer-sand" size={24} {...props} />,
        }}
      />
      <BottomTab.Screen
        name="poses"
        component={PosesScreen}
        options={{
          title: bottomTabTitles.poses,
          tabBarLabel: bottomTabTitles.poses,
          tabBarIcon: (props) => <MaterialCommunityIcons name="yoga" size={24} {...props} />,
        }}
      />
      <BottomTab.Screen
        name="music"
        component={MusicScreen}
        options={{
          title: bottomTabTitles.music,
          tabBarLabel: bottomTabTitles.music,
          tabBarIcon: (props) => <MaterialCommunityIcons name="music" size={24} {...props} />,
        }}
      />
      <BottomTab.Screen
        name="playlists"
        component={PlaylistsScreen}
        options={{
          title: bottomTabTitles.playlists,
          tabBarLabel: bottomTabTitles.playlists,
          tabBarIcon: (props) => (
            <MaterialCommunityIcons name="playlist-star" size={24} {...props} />
          ),
        }}
      />
      <BottomTab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: bottomTabTitles.settings,
          tabBarLabel: bottomTabTitles.settings,
          tabBarIcon: (props) => <MaterialCommunityIcons name="cog" size={24} {...props} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

function Header({ back, options, navigation }: NativeStackHeaderProps) {
  return (
    <Appbar.Header>
      {back ? (
        <Appbar.BackAction accessible accessibilityLabel={back.title} onPress={navigation.goBack} />
      ) : null}
      <Appbar.Content title={options.headerTitle || options.title} />
    </Appbar.Header>
  )
}

interface AppNavigatorProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: AppNavigatorProps) => {
  return (
    <NavigationContainer<AppParamList> {...props} ref={navigationRef}>
      <AppStack.Navigator
        initialRouteName="welcome"
        screenOptions={{
          animation: "slide_from_right",
          header: (props) => <Header {...props} />,
        }}
      >
        <AppStack.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{ title: "Willkommen" }}
        />
        <AppStack.Screen
          name="tabs"
          component={BottomTabNavigator}
          options={({ route }) => ({
            headerShown: false,
            title: getBottomTabTitle(route),
            // headerBackAccessibilityLabel: getTitle(route),
          })}
        />
        <AppStack.Screen name="player" component={PlayerScreen} options={{ title: "Player" }} />
        <AppStack.Screen
          name="selectPoses"
          component={SelectPosesScreen}
          options={{ title: "Übungen auswählen" }}
        />
        <AppStack.Screen
          name="orderPoses"
          component={OrderPosesScreen}
          options={{ title: "Übungen sortieren" }}
        />
        <AppStack.Screen
          name="selectMusic"
          component={SelectMusicScreen}
          options={{ title: "Hintergrundmusik auswählen" }}
        />
        <AppStack.Screen
          name="namePlaylist"
          component={NamePlaylistScreen}
          options={{ title: "Playlist benennen" }}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  )
}

AppNavigator.displayName = "AppNavigator"

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["welcome"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
