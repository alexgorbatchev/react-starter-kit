import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { GoogleLogin } from "../google-login";

const meta: Meta<typeof GoogleLogin> = {
  component: GoogleLogin,
  tags: ["skip-test"],
  args: {
    onError: () => undefined,
    onLoadingChange: () => undefined,
    returnTo: "/dashboard",
  },
  parameters: {
    appStory: {
      initialHref: "/login",
    },
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Continue with Google" }),
    ).toBeInTheDocument();
  },
};

export { Default as GoogleLogin };
