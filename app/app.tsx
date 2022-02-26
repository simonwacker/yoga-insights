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
import React, { useEffect } from "react"
import { useColorScheme } from "react-native"
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context"
import { initFonts } from "./theme/fonts" // expo
import { useBackButtonHandler, AppNavigator, canExit, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./components"
import { Provider as PaperProvider } from "react-native-paper"

// This puts screens in a native ViewController or Activity. If you want fully native
// stack navigation, use `createNativeStackNavigator` in place of `createStackNavigator`:
// https://github.com/kmagiera/react-native-screens#using-native-stack-navigator
import { enableScreens } from "react-native-screens"
import { useState } from "react"
import * as FileSystem from "expo-file-system"
import { tracksDirectoryUri } from "./utils/file"
import { TrackDownloadsClientProvider } from "./contexts/TrackDownloadsClientContext"
import { TrackDownloadsClient } from "./clients/TrackDownloadsClient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { navigatorTheme, theme } from "./theme"
import { GestureHandlerRootView } from "react-native-gesture-handler"

enableScreens()

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

/**
 * This is the root component of our app.
 */
function App() {
  const [ready, setReady] = useState(false)

  const colorScheme = useColorScheme()

  useBackButtonHandler(canExit)
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(NAVIGATION_PERSISTENCE_KEY)

  // Kick off initial async loading actions, like loading fonts
  useEffect(() => {
    ;(async () => {
      await initFonts() // expo
      await FileSystem.makeDirectoryAsync(tracksDirectoryUri, { intermediates: true })
      setReady(true)
    })()
  }, [])

  if (!ready || !isNavigationStateRestored) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <TrackDownloadsClientProvider client={new TrackDownloadsClient()}>
          <PaperProvider
            theme={theme(colorScheme)}
            settings={{
              icon: ({ name, ...props }) => (
                // TODO avoid unsafe cast of name
                <MaterialCommunityIcons
                  name={name as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
                  {...props}
                />
              ),
            }}
          >
            <ErrorBoundary catchErrors={"always"}>
              <AppNavigator
                initialState={initialNavigationState}
                onStateChange={onNavigationStateChange}
                theme={navigatorTheme(colorScheme)}
              />
            </ErrorBoundary>
          </PaperProvider>
        </TrackDownloadsClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
