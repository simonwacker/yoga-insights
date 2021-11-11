import * as React from "react"
import { Text } from "../text/text"
import { textPresets } from "./button.presets"
import { ButtonProps } from "./button.props"
import { Button as PaperButton } from "react-native-paper"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const {
    preset = "primary",
    title: text,
    textStyle: textStyleOverride,
    children,
    onPress,
    disabled,
  } = props

  const textStyle = textPresets[preset] || textPresets.primary
  const textStyles = [textStyle, textStyleOverride]

  const content = children || <Text text={text} style={textStyles} />

  // TODO Is setting `onMagicTap` necessary?
  return (
    <PaperButton
      mode="contained"
      uppercase={false}
      onPress={onPress}
      onMagicTap={onPress}
      disabled={disabled}
    >
      {content}
    </PaperButton>
  )
}
