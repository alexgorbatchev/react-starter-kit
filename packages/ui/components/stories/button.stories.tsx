import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../button";

function ButtonHarness() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="space-y-3">
      <Button onClick={() => setClickCount((currentCount) => currentCount + 1)}>
        Save changes
      </Button>
      <p>Click count: {clickCount}</p>
    </div>
  );
}

const meta: Meta<typeof Button> = {
  title: "@repo/ui/components/button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return <ButtonHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Click count: 0")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
    await expect(canvas.getByText("Click count: 1")).toBeInTheDocument();
  },
};

export { Default as Button };
