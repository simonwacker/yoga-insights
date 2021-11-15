import * as React from "react"
import { Button as PaperButton } from "react-native-paper"

// Having `extends PressableProps` does not work because `children` is not optional there.
export interface ButtonProps {
  title: string
  onPress?: () => void
  disabled?: boolean
}

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Button({ onPress, disabled, title }: ButtonProps) {
  // TODO Is setting `onMagicTap` necessary?
  return (
    <PaperButton
      mode="contained"
      uppercase={false}
      onPress={onPress}
      onMagicTap={onPress}
      disabled={disabled}
    >
      {title}
    </PaperButton>
  )
}
