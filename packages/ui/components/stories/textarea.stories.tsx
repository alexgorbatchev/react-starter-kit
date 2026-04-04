import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Label } from "../label";
import { Textarea } from "../textarea";

function TextareaHarness() {
  const [value, setValue] = useState("");

  return (
    <div className="grid w-96 gap-3">
      <Label htmlFor="storybook-textarea">Project note</Label>
      <Textarea
        id="storybook-textarea"
        placeholder="Add a note"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p>{value ? `Character count: ${value.length}` : "Character count: 0"}</p>
    </div>
  );
}

const meta: Meta<typeof Textarea> = {
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return <TextareaHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox", { name: "Project note" });

    await expect(canvas.getByText("Character count: 0")).toBeInTheDocument();
    await userEvent.type(textarea, "Line one{enter}Line two");
    await expect(textarea).toHaveValue("Line one\nLine two");
    await expect(canvas.getByText("Character count: 17")).toBeInTheDocument();
  },
};

export { Default as Textarea };
