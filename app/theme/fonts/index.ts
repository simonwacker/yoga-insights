import * as Font from "expo-font"
import { MaterialCommunityIcons } from "@expo/vector-icons"

// https://docs.expo.dev/guides/preloading-and-caching-assets/#pre-loading-and-caching-assets
export const initFonts = async () => {
  await Font.loadAsync(MaterialCommunityIcons.font)
}
