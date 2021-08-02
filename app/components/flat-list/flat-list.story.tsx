import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { FlatList } from "./flat-list"
import { Text } from "../text/text"

storiesOf("FlatList", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <FlatList
          data={[]}
          renderItem={(item) => <Text>{item}</Text>}
          style={{ backgroundColor: color.error }}
        />
      </UseCase>
    </Story>
  ))
