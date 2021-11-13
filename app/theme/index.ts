import { ColorSchemeName } from "react-native"
import { Theme } from "react-native-paper/lib/typescript/types"
import { configureFonts, DefaultTheme, DarkTheme } from "react-native-paper"
import {
  Theme as NavigatorTheme,
  DefaultTheme as NavigatorDefaultTheme,
  DarkTheme as NavigatorDarkTheme,
} from "@react-navigation/native"

export * from "./color"
export * from "./spacing"
export * from "./typography"
export * from "./timing"

// TODO Put themes somewhere else and combine them.

export const theme = (colorScheme: ColorSchemeName): Theme =>
  colorScheme === "dark"
    ? DarkTheme
    : {
        ...DefaultTheme,
        dark: false,
        roundness: 4,
        colors: {
          primary: "#6200ee",
          accent: "#03dac4",
          background: "#f6f6f6",
          surface: "#ffffff",
          error: "#B00020",
          text: "#000000",
          onSurface: "#000000",
          disabled: "rgba(0, 0, 0, 0.26)",
          placeholder: "rgba(0, 0, 0, 0.54)",
          backdrop: "rgba(0, 0, 0, 0.5)",
          notification: "#f50057",
        },
        fonts: configureFonts(),
        animation: {
          scale: 1.0,
        },
      }

export const navigatorTheme = (colorScheme: ColorSchemeName): NavigatorTheme =>
  colorScheme === "dark"
    ? {
        ...NavigatorDarkTheme,
      }
    : {
        ...NavigatorDefaultTheme,
      }
