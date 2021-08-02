import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { TrackSectionList } from "./track-section-list"

storiesOf("TrackSectionList", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <TrackSectionList
          sections={[]}
          onSelectTrack={(initialTrackIndex, trackIds) => {}}
          style={{ backgroundColor: color.error }}
        />
      </UseCase>
    </Story>
  ))
