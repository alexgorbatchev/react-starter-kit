import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "../checkbox";
import { Label } from "../label";

function CheckboxHarness() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isChecked}
          id="marketing-consent"
          onCheckedChange={(checked) => setIsChecked(checked === true)}
        />
        <Label htmlFor="marketing-consent">Email me product updates</Label>
      </div>
      <p>
        {isChecked ? "Product updates enabled" : "Product updates disabled"}
      </p>
    </div>
  );
}

const meta: Meta<typeof Checkbox> = {
  title: "@repo/ui/components/checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return <CheckboxHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: "Email me product updates",
    });

    await expect(checkbox).not.toBeChecked();
    await expect(
      canvas.getByText("Product updates disabled"),
    ).toBeInTheDocument();
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(
      canvas.getByText("Product updates enabled"),
    ).toBeInTheDocument();
  },
};

export { Default as Checkbox };
