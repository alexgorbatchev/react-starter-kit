import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { RootRoute } from "../RootRoute";

const meta: Meta<typeof RootRoute> = {
  component: RootRoute,
  tags: ["skip-test"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="max-w-xl rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          RootRoute is exercised through route-mounted stories because it
          depends on TanStack Router outlet context.
        </div>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/RootRoute is exercised through route-mounted stories/),
    ).toBeInTheDocument();
  },
};

export { Default as RootRoute };
