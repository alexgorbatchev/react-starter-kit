import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { AboutPage } from "../AboutPage";

function AboutPageHarness() {
  const [lastVisitedLink, setLastVisitedLink] = useState("none");

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
        setLastVisitedLink(anchor.textContent?.trim() ?? "unknown");
      }}
    >
      <AboutPage />
      <p className="px-4 pb-8 text-center text-sm text-muted-foreground">
        Last visited link: {lastVisitedLink}
      </p>
    </div>
  );
}

const meta: Meta<typeof AboutPage> = {
  title: "@repo/app/components/pages/AboutPage",
  component: AboutPage,
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return <AboutPageHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("link", { name: "Visit Kriasoft on GitHub" }),
    );
    await expect(
      canvas.getByText("Last visited link: Visit Kriasoft on GitHub"),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("link", { name: "Get Started Now" }),
    );
    await expect(
      canvas.getByText("Last visited link: Get Started Now"),
    ).toBeInTheDocument();
  },
};

export { Default as AboutPage };
