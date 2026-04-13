import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

const meta: Meta<typeof Select> = {
  title: "@repo/ui/components/select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <Select defaultValue="starter" open>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Select a plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      body.getByRole("option", { name: "Starter" }),
    ).toBeInTheDocument();
    await expect(
      body.getByRole("option", { name: "Enterprise" }),
    ).toBeInTheDocument();
  },
};

export { Default as Select };
