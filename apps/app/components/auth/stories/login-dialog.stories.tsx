import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { LoginDialog } from "../login-dialog";

const meta: Meta<typeof LoginDialog> = {
  component: LoginDialog,
  args: {
    onOpenChange: () => undefined,
    open: true,
  },
  parameters: {
    appStory: {
      initialHref: "/reports?view=monthly",
    },
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      body.getByRole("dialog", { name: "Sign in to your account" }),
    ).toBeInTheDocument();
    await expect(
      body.getByRole("button", { name: "Continue with email" }),
    ).toBeInTheDocument();
  },
};

export { Default as LoginDialog };
