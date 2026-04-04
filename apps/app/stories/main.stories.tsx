import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { Main } from "../main";

const meta: Meta<typeof Main> = {
  component: Main,
  tags: ["skip-test"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="max-w-xl rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          Main is integration-only because it owns the live router and React
          root wiring. Storybook coverage focuses on the routed components
          beneath it.
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
      canvas.getByText(
        /Main is integration-only because it owns the live router/,
      ),
    ).toBeInTheDocument();
  },
};

export { Default as Main };
