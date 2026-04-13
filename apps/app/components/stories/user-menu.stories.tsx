import type { Meta, StoryObj } from "@storybook/react-vite";
import { useQueryClient } from "@tanstack/react-query";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@repo/ui";
import { authenticatedSession } from "../../stories/AppStoryDecorator";
import { sessionQueryKey } from "../../lib/queries/session";
import { UserMenu } from "../user-menu";

function UserMenuHarness() {
  const queryClient = useQueryClient();

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={() => queryClient.setQueryData(sessionQueryKey, null)}
          variant="outline"
        >
          Clear session
        </Button>
        <Button
          onClick={() =>
            queryClient.setQueryData(sessionQueryKey, authenticatedSession)
          }
          variant="outline"
        >
          Restore session
        </Button>
      </div>
      <div className="w-80 rounded-lg border bg-background">
        <UserMenu />
      </div>
    </div>
  );
}

const meta: Meta<typeof UserMenu> = {
  title: "@repo/app/components/user-menu",
  component: UserMenu,
  parameters: {
    appStory: {
      session: authenticatedSession,
    },
    layout: "centered",
  },
  render: () => {
    return <UserMenuHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Alex Example")).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Clear session" }),
    );
    await expect(canvas.queryByText("Alex Example")).toBeNull();
    await userEvent.click(
      canvas.getByRole("button", { name: "Restore session" }),
    );
    await expect(canvas.getByText("Alex Example")).toBeInTheDocument();
  },
};

export { Default as UserMenu };
