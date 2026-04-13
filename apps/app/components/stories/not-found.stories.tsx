import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { NotFound } from "../not-found";

function NotFoundHarness() {
  const [lastNavigationRequest, setLastNavigationRequest] = useState("none");

  return (
    <div
      onClickCapture={(event) => {
        if (!(event.target instanceof HTMLElement)) {
          return;
        }

        const anchor = event.target.closest("a");
        if (!(anchor instanceof HTMLAnchorElement)) {
          return;
        }

        event.preventDefault();
        setLastNavigationRequest(anchor.getAttribute("href") ?? "unknown");
      }}
    >
      <NotFound />
      <p className="p-6 text-center text-sm text-muted-foreground">
        Last navigation request: {lastNavigationRequest}
      </p>
    </div>
  );
}

const meta: Meta<typeof NotFound> = {
  title: "@repo/app/components/not-found",
  component: NotFound,
  parameters: {
    appStory: {
      initialHref: "/missing",
    },
    layout: "fullscreen",
  },
  render: () => {
    return <NotFoundHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("link", { name: "Go Home" }));
    await expect(
      canvas.getByText("Last navigation request: /"),
    ).toBeInTheDocument();
  },
};

export { Default as NotFound };
