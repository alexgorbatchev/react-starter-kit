import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { authenticatedSession } from "../../../stories/AppStoryDecorator";
import { Sidebar } from "../sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "@repo/app/components/layout/sidebar",
  component: Sidebar,
  args: {
    isOpen: true,
  },
  parameters: {
    appStory: {
      initialHref: "/users",
      session: authenticatedSession,
    },
    layout: "fullscreen",
  },
  render: (args) => {
    return (
      <div className="h-screen bg-background">
        <Sidebar {...args} />
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const usersLink = canvas.getByRole("link", { name: "Users" });
    const reportsLink = canvas.getByRole("link", { name: "Reports" });

    await expect(usersLink).toHaveAttribute("aria-current", "page");
    await userEvent.click(reportsLink);
    await expect(reportsLink).toHaveAttribute("aria-current", "page");
    await expect(
      canvas.getByRole("button", { name: "Sign out" }),
    ).toBeInTheDocument();
  },
};

export { Default as Sidebar };
