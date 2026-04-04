import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <RadioGroup className="gap-3" defaultValue="weekly">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="digest-daily" value="daily" />
          <Label htmlFor="digest-daily">Daily digest</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="digest-weekly" value="weekly" />
          <Label htmlFor="digest-weekly">Weekly digest</Label>
        </div>
      </RadioGroup>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("radio", { name: "Weekly digest" }),
    ).toBeChecked();
    await expect(
      canvas.getByRole("radio", { name: "Daily digest" }),
    ).not.toBeChecked();
  },
};

export { Default as RadioGroup };
