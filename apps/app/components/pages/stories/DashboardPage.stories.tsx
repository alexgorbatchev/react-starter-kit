import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { DashboardPage } from "../DashboardPage";

function DashboardPageHarness() {
  const [lastAction, setLastAction] = useState("none");

  return (
    <div
      onClickCapture={(event) => {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }

        const button = event.target.closest("button");
        if (!(button instanceof HTMLButtonElement)) {
          return;
        }

        setLastAction(button.textContent?.trim() ?? "unknown");
      }}
    >
      <DashboardPage />
      <p className="px-6 pb-6 text-sm text-muted-foreground">
        Last action: {lastAction}
      </p>
    </div>
  );
}

const meta: Meta<typeof DashboardPage> = {
  component: DashboardPage,
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return <DashboardPageHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Generate Report" }),
    );
    await expect(
      canvas.getByText("Last action: Generate Report"),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Export Data" }));
    await expect(
      canvas.getByText("Last action: Export Data"),
    ).toBeInTheDocument();
  },
};

export { Default as DashboardPage };
