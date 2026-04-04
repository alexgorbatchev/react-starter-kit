import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { LoginPage } from "../LoginPage";

const meta: Meta<typeof LoginPage> = {
  component: LoginPage,
  args: {
    returnTo: "/reports",
  },
  parameters: {
    appStory: {
      initialHref: "/login?returnTo=%2Freports",
    },
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Continue with email" }),
    );
    await expect(
      canvas.getByPlaceholderText("Enter your email address..."),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Back to login" }),
    ).toBeInTheDocument();
  },
};

export { Default as LoginPage };
