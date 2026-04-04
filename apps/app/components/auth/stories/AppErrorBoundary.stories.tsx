import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AppErrorBoundary } from "../AppErrorBoundary";

function ThrowStoryError(): never {
  throw new Error("Storybook boundary test error.");
}

const meta: Meta<typeof AppErrorBoundary> = {
  component: AppErrorBoundary,
  parameters: {
    appStory: {},
    layout: "fullscreen",
  },
  render: () => {
    return (
      <AppErrorBoundary>
        <ThrowStoryError />
      </AppErrorBoundary>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Try Again" }),
    ).toBeInTheDocument();
  },
};

export { Default as AppErrorBoundary };
