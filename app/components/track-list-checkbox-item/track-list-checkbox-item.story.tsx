import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { TrackListCheckboxItem } from "./track-list-checkbox-item"

storiesOf("TrackListCheckboxItem", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <TrackListCheckboxItem label="" checked={false} onPress={() => {}} />
      </UseCase>
    </Story>
  ))
