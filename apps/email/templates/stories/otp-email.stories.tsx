import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OtpEmail } from "../otp-email";

const meta: Meta<typeof OtpEmail> = {
  component: OtpEmail,
  args: {
    appName: "React Starter Kit",
    appUrl: "https://example.com",
    expiresInMinutes: 5,
    otp: "123456",
    type: "sign-in",
  },
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

export { Default as OtpEmail };
