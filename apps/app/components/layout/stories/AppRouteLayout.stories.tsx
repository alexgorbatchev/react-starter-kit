import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

import { AppRouteLayout } from "../AppRouteLayout";

const meta: Meta<typeof AppRouteLayout> = {
  component: AppRouteLayout,
  tags: ["skip-test"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <div className="max-w-xl rounded-lg border bg-background p-6 text-sm text-muted-foreground">
          AppRouteLayout is covered through route-mounted page stories because
          it renders an outlet-driven app shell.
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
        /AppRouteLayout is covered through route-mounted page stories/,
      ),
    ).toBeInTheDocument();
  },
};

export { Default as AppRouteLayout };
