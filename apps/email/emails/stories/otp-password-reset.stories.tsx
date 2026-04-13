import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OtpPasswordReset } from "../otp-password-reset";

const meta: Meta<typeof OtpPasswordReset> = {
  title: "@repo/email/emails/otp-password-reset",
  component: OtpPasswordReset,
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

export { Default as OtpPasswordReset };
