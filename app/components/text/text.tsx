import * as React from "react"
import { Text as PaperText } from "react-native-paper"
import { TextProps } from "./text.props"

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  // grab the props
  const { text, children, ...rest } = props

  // figure out which content to use
  const content = text || children

  return (
    <PaperText onPressIn={() => {}} onPressOut={() => {}} {...rest}>
      {content}
    </PaperText>
  )
}
