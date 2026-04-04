import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { OtpVerification } from "../otp-verification";

const meta: Meta<typeof OtpVerification> = {
  component: OtpVerification,
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

export { Default as OtpVerification };
