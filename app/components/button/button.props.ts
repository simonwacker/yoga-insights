import { StyleProp, TextStyle, ViewStyle } from "react-native"
import { ButtonPresetNames } from "./button.presets"

// Having `extends PressableProps` does not work because `children` is not optional there.
export interface ButtonProps {
  onPress?: () => void
  disabled?: boolean

  /**
   * The text to display.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: StyleProp<TextStyle>

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode
}
