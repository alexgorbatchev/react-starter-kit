import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { OtpVerification } from "../otp-verification";

const meta: Meta<typeof OtpVerification> = {
  component: OtpVerification,
  args: {
    email: "alex@example.com",
    onCancel: () => undefined,
    onError: () => undefined,
    onLoadingChange: () => undefined,
    onSuccess: () => undefined,
  },
  parameters: {
    appStory: {
      initialHref: "/login",
    },
    layout: "centered",
  },
  render: (args) => {
    return (
      <div className="w-full max-w-sm rounded-xl bg-background p-8 shadow-sm ring-1 ring-border/50">
        <OtpVerification {...args} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter 6-digit code");
    await userEvent.type(input, "123456");
    await expect(
      canvas.getByRole("button", { name: "Verify code" }),
    ).toBeEnabled();
    await expect(
      canvas.getByRole("button", { name: "Resend code" }),
    ).toBeInTheDocument();
  },
};

export { Default as OtpVerification };
