import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Separator } from "../separator";

const meta: Meta<typeof Separator> = {
  component: Separator,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <div className="flex w-80 items-center gap-4 rounded-md border p-4">
        <span className="text-sm">Usage</span>
        <Separator className="h-6" orientation="vertical" />
        <span className="text-sm text-muted-foreground">1,245 API calls</span>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Usage")).toBeInTheDocument();
    await expect(canvas.getByText("1,245 API calls")).toBeInTheDocument();
  },
};

export { Default as Separator };
