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

// Suppress React error boundaries logging expected test errors to stderr in browser
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("The above error occurred in the") ||
      args[0].includes("React will try to recreate this component tree") ||
      args[0] === "Uncaught error:" ||
      args[0] === "Error caught by boundary:")
  ) {
    return;
  }
  originalConsoleError(...args);
};

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
