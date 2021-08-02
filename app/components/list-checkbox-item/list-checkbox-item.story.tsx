import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { ListCheckboxItem } from "./list-checkbox-item"

storiesOf("ListCheckboxItem", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <ListCheckboxItem label="" checked={false} onPress={() => {}} />
      </UseCase>
    </Story>
  ))
