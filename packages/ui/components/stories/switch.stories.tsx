import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Label } from "../label";
import { Switch } from "../switch";

function SwitchHarness() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Switch
          checked={isEnabled}
          id="dark-mode"
          onCheckedChange={setIsEnabled}
        />
        <Label htmlFor="dark-mode">Enable dark mode</Label>
      </div>
      <p>{isEnabled ? "Dark mode enabled" : "Dark mode disabled"}</p>
    </div>
  );
}

const meta: Meta<typeof Switch> = {
  title: "@repo/ui/components/switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return <SwitchHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const switchControl = canvas.getByRole("switch", {
      name: "Enable dark mode",
    });

    await expect(switchControl).not.toBeChecked();
    await expect(canvas.getByText("Dark mode disabled")).toBeInTheDocument();
    await userEvent.click(switchControl);
    await expect(switchControl).toBeChecked();
    await expect(canvas.getByText("Dark mode enabled")).toBeInTheDocument();
  },
};

export { Default as Switch };
