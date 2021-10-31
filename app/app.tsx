/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "react-native-gesture-handler"
import React, { useEffect, useRef } from "react"
import { NavigationContainerRef } from "@react-navigation/native"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { initFonts } from "./theme/fonts" // expo
import {
  useBackButtonHandler,
  RootNavigator,
  canExit,
  setRootNavigation,
  useNavigationPersistence,
  RootParamList,
} from "./navigators"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
import { useState } from "react"
import * as FileSystem from "expo-file-system"
import { tracksDirectoryUri } from "./utils/file"
import { TrackDownloadsClientProvider } from "./contexts/TrackDownloadsClientContext"
import { TrackDownloadsClient } from "./clients/TrackDownloadsClient"
enableScreens()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
function App() {
  const [ready, setReady] = useState(false)
  const navigationRef = useRef<NavigationContainerRef<RootParamList>>(null)

  setRootNavigation(navigationRef)
  useBackButtonHandler(navigationRef, canExit)
  const { initialNavigationState, onNavigationStateChange } = useNavigationPersistence(
    NAVIGATION_PERSISTENCE_KEY,
  )

  // Kick off initial async loading actions, like loading fonts
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      await FileSystem.makeDirectoryAsync(tracksDirectoryUri, { intermediates: true })
      setReady(true)
    })()
  }, [])

  if (!ready) return null

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <TrackDownloadsClientProvider client={new TrackDownloadsClient()}>
        <RootNavigator
          ref={navigationRef}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </TrackDownloadsClientProvider>
    </SafeAreaProvider>
  )
}

export default App
