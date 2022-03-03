import * as React from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleProp, ViewStyle } from "react-native"

export interface ScreenProps {
  /**
   * Children components.
   */
  children?: React.ReactNode

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * One of the different types of presets.
   */
  preset?: ScreenPresets

  /**
   * An optional background color
   */
  backgroundColor?: string

  /**
   * An optional status bar setting. Defaults to light-content.
   */
  statusBar?: "light-content" | "dark-content"

  /**
   * Should we not wrap in SafeAreaView? Defaults to false.
   */
  unsafe?: boolean

  /**
   * By how much should we offset the keyboard? Defaults to none.
   */
  keyboardOffset?: KeyboardOffsets

  /**
   * Should keyboard persist on screen tap. Defaults to handled.
   * Only applies to scroll preset.
   */
  keyboardShouldPersistTaps?: "handled" | "always" | "never"

  onAccessibilityEscape?: (() => void) | undefined
  onAccessibilityTap?: (() => void) | undefined
  onMagicTap?: (() => void) | undefined
}

/**
 * All screen keyboard offsets.
 */
export const offsets = {
  none: 0,
}

/**
 * The variations of keyboard offsets.
 */
export type KeyboardOffsets = keyof typeof offsets

/**
 * All the variations of screens.
 */
export const presets = {
  /**
   * No scrolling. Suitable for full-screen carousels and components
   * which have built-in scrolling like FlatList.
   */
  fixed: {
    outer: {
      flex: 1,
      height: "100%",
    } as ViewStyle,
    inner: {
      justifyContent: "flex-start",
      alignItems: "stretch",
      height: "100%",
      width: "100%",
    } as ViewStyle,
  },

  /**
   * Scrolls. Suitable for forms or other things requiring a keyboard.
   *
   * Pick this one if you don't know which one you want yet.
   */
  scroll: {
    outer: {
      flex: 1,
      height: "100%",
    } as ViewStyle,
    inner: { justifyContent: "flex-start", alignItems: "stretch" } as ViewStyle,
  },
}

/**
 * The variations of screens.
 */
export type ScreenPresets = keyof typeof presets

/**
 * Is this preset a non-scrolling one?
 *
 * @param preset The preset to check
 */
export function isNonScrolling(preset?: ScreenPresets) {
  // any of these things will make you scroll
  return !preset || !presets[preset] || preset === "fixed"
}

const isIos = Platform.OS === "ios"

function ScreenWithoutScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.fixed
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? "padding" : "height"}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={props.statusBar || "light-content"} />
      <View
        style={[preset.inner, style, insetStyle]}
        onAccessibilityEscape={props.onAccessibilityEscape}
        onAccessibilityTap={props.onAccessibilityTap}
        onMagicTap={props.onMagicTap}
      >
        {props.children}
      </View>
    </KeyboardAvoidingView>
  )
}

function ScreenWithScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets()
  const preset = presets.scroll
  const style = props.style || {}
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top }

  return (
    <KeyboardAvoidingView
      style={[preset.outer, backgroundStyle]}
      behavior={isIos ? "padding" : "height"}
      keyboardVerticalOffset={offsets[props.keyboardOffset || "none"]}
    >
      <StatusBar barStyle={props.statusBar || "light-content"} />
      <View
        style={[preset.outer, backgroundStyle, insetStyle]}
        onAccessibilityEscape={props.onAccessibilityEscape}
        onAccessibilityTap={props.onAccessibilityTap}
        onMagicTap={props.onMagicTap}
      >
        <ScrollView
          style={[preset.outer, backgroundStyle]}
          contentContainerStyle={[preset.inner, style]}
          keyboardShouldPersistTaps={props.keyboardShouldPersistTaps || "handled"}
        >
          {props.children}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  if (isNonScrolling(props.preset)) {
    return <ScreenWithoutScrolling {...props} />
  } else {
    return <ScreenWithScrolling {...props} />
  }
}
