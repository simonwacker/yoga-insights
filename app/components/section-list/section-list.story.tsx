import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { SectionList } from "./section-list"

storiesOf("TrackSectionList", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <SectionList
          getSectionTitle={() => ""}
          sections={[]}
          style={{ backgroundColor: color.error }}
        />
      </UseCase>
    </Story>
  ))
