import { useState, useEffect, useRef } from "react"
import { BackHandler } from "react-native"
import {
  PartialState,
  NavigationAction,
  NavigationState,
  createNavigationContainerRef,
} from "@react-navigation/native"
import * as storage from "../utils/storage"
import { AppParamList } from "./app-navigator"

/* eslint-disable */
export const AppNavigation = {
  navigate(_name: string, _params?: any) {},
  goBack() {},
  resetApp(_state?: PartialState<NavigationState> | NavigationState) {},
  getAppState(): NavigationState {
    return {} as any
  },
  dispatch(_action: NavigationAction) {},
}
/* eslint-enable */

export const navigationRef = createNavigationContainerRef<AppParamList>()

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(state: NavigationState | PartialState<NavigationState>): string {
  if (state.index === undefined) {
    throw new Error("expected state.index to exist")
  }
  const route = state.routes[state.index]

  // Found the active route -- return the name
  if (!route.state) return route.name

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state)
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(canExit: (routeName: string) => boolean) {
  const canExitRef = useRef(canExit)

  useEffect(() => {
    canExitRef.current = canExit
  }, [canExit])

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      if (!navigationRef.isReady()) {
        return false
      }

      // grab the current route
      const routeName = getActiveRouteName(navigationRef.getRootState())

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // let the system know we've not handled this event
        return false
      }

      // we can't exit, so let's turn this into a back action
      if (navigationRef.canGoBack()) {
        navigationRef.goBack()
        return true
      }

      return false
    }

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress)

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress)
  }, [])
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(persistenceKey: string) {
  const [initialNavigationState, setInitialNavigationState] = useState<NavigationState | undefined>(
    undefined,
  )

  const [isRestored, setIsRestored] = useState(false)

  const routeNameRef = useRef<string | undefined>()

  const onNavigationStateChange = (state: NavigationState | undefined) => {
    if (state === undefined) {
      storage.remove(persistenceKey)
    } else {
      const previousRouteName = routeNameRef.current
      const currentRouteName = getActiveRouteName(state)

      if (previousRouteName !== currentRouteName) {
        // track screens.
        __DEV__ && console.log(currentRouteName)
      }

      // Save the current route name for later comparision
      routeNameRef.current = currentRouteName

      // Persist state to storage
      storage.save(persistenceKey, state)
    }
  }

  const restoreState = async () => {
    try {
      const state = await storage.load(persistenceKey)
      if (state) setInitialNavigationState(state)
    } finally {
      setIsRestored(true)
    }
  }

  useEffect(() => {
    if (!isRestored) restoreState()
  }, [isRestored])

  return { onNavigationStateChange, restoreState, isRestored, initialNavigationState }
}

/**
 * use this to navigate to navigate without the navigation
 * prop. If you have access to the navigation prop, do not use this.
 * More info: https://reactnavigation.org/docs/navigating-without-navigation-prop/
 */
export function navigate(name: any, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never)
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack()
  }
}

export function resetApp(params = { index: 0, routes: [] }) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(params)
  }
}
