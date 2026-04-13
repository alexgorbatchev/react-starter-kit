import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AuthErrorBoundary } from "../auth-error-boundary";

function ThrowUnauthorizedError(): never {
  throw { status: 401, statusText: "Unauthorized" };
}

const meta: Meta<typeof AuthErrorBoundary> = {
  title: "@repo/app/components/auth/auth-error-boundary",
  component: AuthErrorBoundary,
  parameters: {
    appStory: {},
    layout: "fullscreen",
  },
  render: () => {
    return (
      <AuthErrorBoundary>
        <ThrowUnauthorizedError />
      </AuthErrorBoundary>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Authentication Required" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Sign In" }),
    ).toBeInTheDocument();
  },
};

export { Default as AuthErrorBoundary };
