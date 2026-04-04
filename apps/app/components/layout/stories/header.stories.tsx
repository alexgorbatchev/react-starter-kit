import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Header } from "../header";

function HeaderHarness() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div>
      <Header
        isSidebarOpen={isSidebarOpen}
        onMenuToggle={() => setIsSidebarOpen((currentValue) => !currentValue)}
      />
      <p className="p-4">Sidebar is {isSidebarOpen ? "open" : "closed"}</p>
    </div>
  );
}

const meta: Meta<typeof Header> = {
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return <HeaderHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Sidebar is open")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Collapse sidebar" }),
    );
    await expect(canvas.getByText("Sidebar is closed")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Expand sidebar" }),
    );
    await expect(canvas.getByText("Sidebar is open")).toBeInTheDocument();
  },
};

export { Default as Header };
