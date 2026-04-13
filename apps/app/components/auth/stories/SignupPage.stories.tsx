import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { SignupPage } from "../SignupPage";

const meta: Meta<typeof SignupPage> = {
  title: "@repo/app/components/auth/SignupPage",
  component: SignupPage,
  args: {
    returnTo: "/settings",
  },
  parameters: {
    appStory: {
      initialHref: "/signup?returnTo=%2Fsettings",
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
      canvas.getByText(/By signing up, you agree to our/),
    ).toBeInTheDocument();
  },
};

export { Default as SignupPage };
