import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { authenticatedSession } from "../../../stories/AppStoryDecorator";
import { Layout } from "../Layout";

const meta: Meta<typeof Layout> = {
  title: "@repo/app/components/layout/Layout",
  component: Layout,
  parameters: {
    appStory: {
      initialHref: "/analytics",
      session: authenticatedSession,
    },
    layout: "fullscreen",
  },
  render: () => {
    return (
      <Layout>
        <div className="p-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Storybook content panel</h2>
            <p className="mt-2 text-muted-foreground">
              This canvas verifies the app shell with a mounted sidebar and
              header.
            </p>
          </div>
        </div>
      </Layout>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByTestId("Sidebar");

    await expect(sidebar.className).toContain("w-64");
    await userEvent.click(
      canvas.getByRole("button", { name: "Collapse sidebar" }),
    );
    await expect(sidebar.className).toContain("w-0");
    await userEvent.click(
      canvas.getByRole("button", { name: "Expand sidebar" }),
    );
    await expect(sidebar.className).toContain("w-64");
  },
};

export { Default as Layout };
