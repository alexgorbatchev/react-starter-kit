import type { Meta, StoryObj } from "@storybook/react-vite";
import { useQueryClient } from "@tanstack/react-query";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@repo/ui";
import { billingQueryKey } from "@/lib/queries/billing";
import {
  activeStarterBilling,
  authenticatedSession,
  cancelingProBilling,
} from "../../../stories/AppStoryDecorator";
import { BillingCard } from "../BillingCard";

function BillingCardHarness() {
  const queryClient = useQueryClient();
  const activeOrganizationId =
    authenticatedSession.session.activeOrganizationId ?? null;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={() =>
            queryClient.setQueryData(
              [...billingQueryKey, activeOrganizationId] as const,
              activeStarterBilling,
            )
          }
          variant="outline"
        >
          Show active billing
        </Button>
        <Button
          onClick={() =>
            queryClient.setQueryData(
              [...billingQueryKey, activeOrganizationId] as const,
              cancelingProBilling,
            )
          }
          variant="outline"
        >
          Show canceling billing
        </Button>
        <Button
          onClick={() =>
            queryClient.setQueryData(
              [...billingQueryKey, activeOrganizationId] as const,
              null,
            )
          }
          variant="outline"
        >
          Show free billing
        </Button>
      </div>
      <div className="w-full max-w-xl">
        <BillingCard />
      </div>
    </div>
  );
}

const meta: Meta<typeof BillingCard> = {
  component: BillingCard,
  parameters: {
    appStory: {
      billing: activeStarterBilling,
      session: authenticatedSession,
    },
    layout: "centered",
  },
  render: () => {
    return <BillingCardHarness />;
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("button", { name: "Manage Billing" }),
    ).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Show free billing" }),
    );
    await expect(
      canvas.getByText("You are on the Free plan."),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Upgrade to Pro" }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Show canceling billing" }),
    );
    await expect(canvas.getByText(/will not renew/)).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Show active billing" }),
    );
    await expect(
      canvas.getByRole("button", { name: "Manage Billing" }),
    ).toBeInTheDocument();
  },
};

export { Default as BillingCard };
