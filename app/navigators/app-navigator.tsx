/**
 * The app navigator is used for the primary navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot
 * password) and a "main" flow which the user will use once logged in.
 */
import React from "react"
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
  CompositeNavigationProp,
  RouteProp,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import { useColorScheme } from "react-native"
import { navigationRef } from "./navigation-utilities"
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
import { palette } from "../theme/palette"

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

export type MainParamList = {
  tabs: NavigatorScreenParams<BottomTabParamList>
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

export type AppParamList = {
  main: NavigatorScreenParams<MainParamList>
}

export type ClassesScreenRouteProp = RouteProp<BottomTabParamList, "classes">
export type ClassesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "classes">,
  NativeStackNavigationProp<MainParamList>
>

export type PosesScreenRouteProp = RouteProp<BottomTabParamList, "poses">
export type PosesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "poses">,
  NativeStackNavigationProp<MainParamList>
>

export type MusicScreenRouteProp = RouteProp<BottomTabParamList, "music">
export type MusicScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "music">,
  NativeStackNavigationProp<MainParamList>
>

export type PlaylistsScreenRouteProp = RouteProp<BottomTabParamList, "playlists">
export type PlaylistsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "playlists">,
  NativeStackNavigationProp<MainParamList>
>

export type SettingsScreenRouteProp = RouteProp<BottomTabParamList, "settings">
export type SettingsScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, "settings">,
  NativeStackNavigationProp<MainParamList>
>

export type TabsScreenRouteProp = RouteProp<MainParamList, "tabs">
export type TabsScreenNavigationProp = NativeStackNavigationProp<MainParamList, "tabs">

export type PlayerScreenRouteProp = RouteProp<MainParamList, "player">
export type PlayerScreenNavigationProp = NativeStackNavigationProp<MainParamList, "player">

export type SelectPosesScreenRouteProp = RouteProp<MainParamList, "selectPoses">
export type SelectPosesScreenNavigationProp = NativeStackNavigationProp<
  MainParamList,
  "selectPoses"
>

export type OrderPosesScreenRouteProp = RouteProp<MainParamList, "orderPoses">
export type OrderPosesScreenNavigationProp = NativeStackNavigationProp<MainParamList, "orderPoses">

export type SelectMusicScreenRouteProp = RouteProp<MainParamList, "selectMusic">
export type SelectMusicScreenNavigationProp = NativeStackNavigationProp<
  MainParamList,
  "selectMusic"
>

export type NamePlaylistScreenRouteProp = RouteProp<MainParamList, "namePlaylist">
export type NamePlaylistScreenNavigationProp = NativeStackNavigationProp<
  MainParamList,
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

const MainStack = createNativeStackNavigator<MainParamList>()

// Documentation: https://reactnavigation.org/docs/tab-based-navigation
const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const AppStack = createNativeStackNavigator<AppParamList>()

export function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName={initialBottomTabRouteName}
      screenOptions={{
        tabBarActiveTintColor: palette.white,
        tabBarInactiveTintColor: palette.black,
        tabBarActiveBackgroundColor: palette.black,
        tabBarInactiveBackgroundColor: palette.white,
      }}
    >
      <BottomTab.Screen
        name="classes"
        component={ClassesScreen}
        options={{ title: bottomTabTitles.classes }}
      />
      <BottomTab.Screen
        name="poses"
        component={PosesScreen}
        options={{ title: bottomTabTitles.poses }}
      />
      <BottomTab.Screen
        name="music"
        component={MusicScreen}
        options={{ title: bottomTabTitles.music }}
      />
      <BottomTab.Screen
        name="playlists"
        component={PlaylistsScreen}
        options={{ title: bottomTabTitles.playlists }}
      />
      <BottomTab.Screen
        name="settings"
        component={SettingsScreen}
        options={{ title: bottomTabTitles.settings }}
      />
    </BottomTab.Navigator>
  )
}

export function MainNavigator() {
  return (
    <MainStack.Navigator
      initialRouteName="tabs"
      screenOptions={{
        animation: "none", // slide_from_right
      }}
    >
      <MainStack.Screen
        name="tabs"
        component={BottomTabNavigator}
        options={({ route }) => ({
          headerShown: false,
          title: getBottomTabTitle(route),
          // headerBackAccessibilityLabel: getTitle(route),
        })}
      />
      <MainStack.Screen name="player" component={PlayerScreen} options={{ title: "Player" }} />
      <MainStack.Screen
        name="selectPoses"
        component={SelectPosesScreen}
        options={{ title: "Übungen auswählen" }}
      />
      <MainStack.Screen
        name="orderPoses"
        component={OrderPosesScreen}
        options={{ title: "Übungen sortieren" }}
      />
      <MainStack.Screen
        name="selectMusic"
        component={SelectMusicScreen}
        options={{ title: "Hintergrundmusik auswählen" }}
      />
      <MainStack.Screen
        name="namePlaylist"
        component={NamePlaylistScreen}
        options={{ title: "Playlist benennen" }}
      />
    </MainStack.Navigator>
  )
}

interface AppNavigatorProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: AppNavigatorProps) => {
  const colorScheme = useColorScheme()
  return (
    <NavigationContainer<AppParamList>
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
      ref={navigationRef}
    >
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
        initialRouteName="main"
      >
        <AppStack.Screen name="main" component={MainNavigator} />
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
const exitRoutes = ["classes"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
