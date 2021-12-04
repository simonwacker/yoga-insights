import React from "react"
import { StyleProp, TextInputProps, TextStyle, ViewStyle } from "react-native"
import { TextInput } from "react-native-paper"
import { color } from "../../theme"

// currently we have no presets, but that changes quickly when you build your app.
const PRESETS: { [name: string]: ViewStyle } = {
  default: {},
}

export interface TextFieldProps extends TextInputProps {
  /**
   * The Placeholder text.
   */
  placeholder?: string

  /**
   * The label text.
   */
  label?: string

  /**
   * Optional container style overrides useful for margins & padding.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Optional style overrides for the input.
   */
  inputStyle?: StyleProp<TextStyle>

  /**
   * Various look & feels.
   */
  preset?: keyof typeof PRESETS

  forwardedRef?: any
}

/**
 * A component which has a label and an input together.
 */
export function TextField(props: TextFieldProps) {
  const { placeholder, label, onChangeText, value } = props

  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={color.dim}
      autoComplete="off"
      underlineColorAndroid={color.transparent}
    />
  )
}
