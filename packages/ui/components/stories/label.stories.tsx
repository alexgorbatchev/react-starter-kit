import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Input } from "../input";
import { Label } from "../label";

const meta: Meta<typeof Label> = {
  component: Label,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <div className="grid gap-2">
        <Label htmlFor="workspace-name">Workspace name</Label>
        <Input defaultValue="Platform Team" id="workspace-name" />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText("Workspace name")).toHaveValue(
      "Platform Team",
    );
  },
};

export { Default as Label };
