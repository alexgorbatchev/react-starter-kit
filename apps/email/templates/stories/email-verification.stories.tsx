import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { EmailVerification } from "../email-verification";

const meta: Meta<typeof EmailVerification> = {
  title: "@repo/email/templates/email-verification",
  component: EmailVerification,
  args: {
    appName: "React Starter Kit",
    appUrl: "https://example.com",
    userName: "Alex Example",
    verificationUrl: "https://example.com/verify?token=storybook",
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

export { Default as EmailVerification };
