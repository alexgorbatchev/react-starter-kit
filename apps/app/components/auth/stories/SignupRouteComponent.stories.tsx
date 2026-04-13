import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { SignupRouteComponent } from "../SignupRouteComponent";

const meta: Meta<typeof SignupRouteComponent> = {
  title: "@repo/app/components/auth/SignupRouteComponent",
  component: SignupRouteComponent,
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

export { Default as SignupRouteComponent };
