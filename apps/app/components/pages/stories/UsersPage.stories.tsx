import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { UsersPage } from "../UsersPage";

function UsersPageHarness() {
  const [lastAction, setLastAction] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");

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

        const actionLabel =
          button.getAttribute("aria-label") ??
          button.textContent?.trim() ??
          "unknown";
        setLastAction(actionLabel);
      }}
      onInputCapture={(event) => {
        if (!(event.target instanceof HTMLInputElement)) {
          return;
        }

        setSearchQuery(event.target.value);
      }}
    >
      <UsersPage />
      <div className="p-6 pt-0 text-sm text-muted-foreground">
        <p>Last action: {lastAction}</p>
        <p>Search query: {searchQuery || "empty"}</p>
      </div>
    </div>
  );
}

const meta: Meta<typeof UsersPage> = {
  title: "@repo/app/components/pages/UsersPage",
  component: UsersPage,
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return <UsersPageHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByRole("textbox", { name: "Search users" });

    await userEvent.type(searchInput, "John");
    await expect(searchInput).toHaveValue("John");
    await expect(canvas.getByText("Search query: John")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Add User" }));
    await expect(canvas.getByText("Last action: Add User")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Open actions for John Doe" }),
    );
    await expect(
      canvas.getByText("Last action: Open actions for John Doe"),
    ).toBeInTheDocument();
  },
};

export { Default as UsersPage };
