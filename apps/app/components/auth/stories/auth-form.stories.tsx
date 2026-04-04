import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { AuthForm } from "../auth-form";

async function handleSuccess(): Promise<void> {}

const meta: Meta<typeof AuthForm> = {
  component: AuthForm,
  args: {
    mode: "login",
    onSuccess: handleSuccess,
    returnTo: "/analytics",
  },
  parameters: {
    appStory: {
      initialHref: "/login?returnTo=%2Fanalytics",
    },
    layout: "centered",
  },
  render: (args) => {
    return (
      <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-sm ring-1 ring-border/50">
        <AuthForm {...args} />
      </div>
    );
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
    await userEvent.type(
      canvas.getByPlaceholderText("Enter your email address..."),
      "alex@example.com",
    );
    await expect(
      canvas.getByRole("button", { name: "Continue with email" }),
    ).toBeEnabled();
  },
};

export { Default as AuthForm };
