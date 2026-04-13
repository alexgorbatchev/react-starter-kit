import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { PasswordReset } from "../password-reset";

const meta: Meta<typeof PasswordReset> = {
  title: "@repo/email/emails/password-reset",
  component: PasswordReset,
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

export { Default as PasswordReset };
