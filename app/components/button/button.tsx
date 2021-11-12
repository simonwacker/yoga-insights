import * as React from "react"
import { ButtonProps } from "./button.props"
import { Button as ElementsButton } from "react-native-elements"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button(props: ButtonProps) {
  // grab the props
  const { title, onPress } = props

  return (
    <ElementsButton
      accessible
      accessibilityRole="button"
      onPress={onPress}
      onMagicTap={onPress}
      title={title}
    />
  )
}
