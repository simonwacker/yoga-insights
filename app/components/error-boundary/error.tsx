import React, { ErrorInfo } from "react"
import { TextStyle, View, ViewStyle, ScrollView, ImageStyle } from "react-native"
import { color } from "../../theme"
import { Icon } from "../icon/icon"
import { Text } from "../text/text"
import { Button } from "../button/button"

const CONTAINER: ViewStyle = {
  alignItems: "center",
  flex: 1,
  padding: 16,
  paddingVertical: 50,
  backgroundColor: color.background,
}

const ERROR_DETAILS_CONTAINER: ViewStyle = {
  width: "100%",
  maxHeight: "60%",
  backgroundColor: color.text,
  marginVertical: 15,
  paddingHorizontal: 15,
  paddingVertical: 0,
  borderRadius: 6,
}

const TITLE_ERROR: TextStyle = {
  color: color.text,
  fontWeight: "bold",
  paddingVertical: 15,
}

const FRIENDLY_SUBTITLE: TextStyle = {
  color: color.text,
  paddingVertical: 15,
}

const CONTENT_ERROR: TextStyle = {
  color: color.background,
  paddingVertical: 15,
}

// Uncomment this and the Text component in the ErrorComponent if
// you want to see a backtrace in your error reporting screen.
// const CONTENT_BACKTRACE: TextStyle = {
//   color: color.dim,
// }

const ICON: ImageStyle = {
  marginTop: 30,
  width: 64,
  height: 64,
}

export interface ErrorProps {
  error: Error
  errorInfo: ErrorInfo | null
  onReset(): void
}

/**
 * Describe your component here
 */
export const Error = (props: ErrorProps) => {
  return (
    <View style={CONTAINER}>
      <Icon style={ICON} icon="bug" />
      <Text style={TITLE_ERROR} text="Etwas ging schief!" />
      <Text
        style={FRIENDLY_SUBTITLE}
        text="Versuche abermals was Du eben getan hast und sofern der Fehler wieder auftritt teile uns das gerne mit und wir versuchen ihn zu reparieren."
      />
      <View style={ERROR_DETAILS_CONTAINER}>
        <ScrollView>
          <Text selectable style={CONTENT_ERROR} text={`${props.error}`} />
          {/* <Text selectable style={CONTENT_BACKTRACE} text={`${props.errorInfo.componentStack}`} /> */}
        </ScrollView>
      </View>
      <Button onPress={props.onReset} title="Okay" />
    </View>
  )
}
