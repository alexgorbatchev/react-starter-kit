import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Avatar, AvatarFallback } from "../avatar";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>AE</AvatarFallback>
        </Avatar>
        <Avatar className="h-12 w-12">
          <AvatarFallback>UI</AvatarFallback>
        </Avatar>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("AE")).toBeInTheDocument();
    await expect(canvas.getByText("UI")).toBeInTheDocument();
  },
};

export { Default as Avatar };
