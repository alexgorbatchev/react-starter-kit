import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Skeleton } from "../skeleton";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <div className="space-y-3 rounded-md border p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-24 w-80" />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByTestId("Skeleton")).toHaveLength(3);
  },
};

export { Default as Skeleton };
