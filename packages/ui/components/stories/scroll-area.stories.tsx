import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ScrollArea } from "../scroll-area";

const items = Array.from(
  { length: 20 },
  (_, index) => `Activity item ${index + 1}`,
);

const meta: Meta<typeof ScrollArea> = {
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <ScrollArea className="h-60 w-80 rounded-md border p-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div className="rounded-md border px-3 py-2 text-sm" key={item}>
              {item}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Activity item 20")).toBeInTheDocument();
  },
};

export { Default as ScrollArea };
