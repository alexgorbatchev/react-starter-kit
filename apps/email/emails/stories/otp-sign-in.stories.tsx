import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OtpSignIn } from "../otp-sign-in";

const meta: Meta<typeof OtpSignIn> = {
  title: "@repo/email/emails/otp-sign-in",
  component: OtpSignIn,
  tags: ["skip-test"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.childElementCount).toBeGreaterThan(0);
  },
};

export { Default as OtpSignIn };
