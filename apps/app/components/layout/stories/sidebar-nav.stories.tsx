import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { sidebarItems } from "../constants";
import { SidebarNav } from "../sidebar-nav";

function SidebarNavHarness() {
  const [lastNavigationTarget, setLastNavigationTarget] = useState("none");

  return (
    <div
      className="w-72 rounded-lg border bg-background"
      onClickCapture={(event) => {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }

        const anchor = event.target.closest("a");
        if (!(anchor instanceof HTMLAnchorElement)) {
          return;
        }

        event.preventDefault();
        setLastNavigationTarget(anchor.getAttribute("href") ?? "unknown");
      }}
    >
      <SidebarNav items={sidebarItems} />
      <p className="p-4 pt-0 text-sm text-muted-foreground">
        Last navigation target: {lastNavigationTarget}
      </p>
    </div>
  );
}

const meta: Meta<typeof SidebarNav> = {
  component: SidebarNav,
  parameters: {
    appStory: {
      initialHref: "/analytics",
    },
    layout: "centered",
  },
  render: () => {
    return <SidebarNavHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("link", { name: "Dashboard" }));
    await expect(
      canvas.getByText("Last navigation target: /"),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("link", { name: "Reports" }));
    await expect(
      canvas.getByText("Last navigation target: /reports"),
    ).toBeInTheDocument();
  },
};

export { Default as SidebarNav };
