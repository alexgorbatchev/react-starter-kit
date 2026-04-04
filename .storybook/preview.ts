import type { Preview } from "@storybook/react-vite";

import type { IAppStoryParameters } from "../apps/app/stories/AppStoryDecorator";
import { renderWithAppStoryDecorator } from "../apps/app/stories/AppStoryDecorator";
import "../apps/app/styles/globals.css";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAppStoryParameters(value: unknown): value is IAppStoryParameters {
  return isRecord(value);
}

const preview: Preview = {
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story, context) => {
      const appStoryParameters = context.parameters.appStory;

      if (!isAppStoryParameters(appStoryParameters)) {
        return Story();
      }

      return renderWithAppStoryDecorator(Story, appStoryParameters);
    },
  ],
};

export default preview;
