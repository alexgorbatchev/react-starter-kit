import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "../input";
import { Label } from "../label";

function InputHarness() {
  const [value, setValue] = useState("");

  return (
    <div className="grid w-80 gap-3">
      <Label htmlFor="storybook-input">Email address</Label>
      <Input
        id="storybook-input"
        placeholder="Email address"
        type="email"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p>{value ? `Current value: ${value}` : "Current value: empty"}</p>
    </div>
  );
}

const meta: Meta<typeof Input> = {
  title: "@repo/ui/components/input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return <InputHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Email address" });

    await expect(canvas.getByText("Current value: empty")).toBeInTheDocument();
    await userEvent.type(input, "alex@example.com");
    await expect(input).toHaveValue("alex@example.com");
    await expect(
      canvas.getByText("Current value: alex@example.com"),
    ).toBeInTheDocument();
  },
};

export { Default as Input };
