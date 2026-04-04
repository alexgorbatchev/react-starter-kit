import { auth } from "@/lib/auth";
import { useBillingQuery } from "@/lib/queries/billing";
import { useSessionQuery } from "@/lib/queries/session";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { CreditCard } from "lucide-react";

type BillingPlanName = "starter" | "pro";

export function BillingCard() {
  const { data: session } = useSessionQuery();
  const activeOrganizationId = session?.session?.activeOrganizationId;
  const { data: billing, isLoading } = useBillingQuery(activeOrganizationId);
  const returnUrl = window.location.href;

  async function handleUpgrade(plan: BillingPlanName): Promise<void> {
    try {
      await auth.subscription.upgrade({
        cancelUrl: returnUrl,
        plan,
        successUrl: returnUrl,
      });
    } catch (error) {
      console.error("Failed to start upgrade:", error);
    }
  }

  async function handleManageBilling(): Promise<void> {
    try {
      await auth.subscription.billingPortal({ returnUrl });
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  }

  const hasSubscription =
    billing?.status === "active" || billing?.status === "trialing";
  const isCanceling = hasSubscription && billing.cancelAtPeriodEnd;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          <CardTitle>Billing</CardTitle>
        </div>
        <CardDescription>
          Manage your subscription and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : hasSubscription ? (
          <>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {billing.plan.charAt(0).toUpperCase() + billing.plan.slice(1)}{" "}
                plan
                <span className="ml-2 text-xs text-muted-foreground">
                  ({billing.status})
                </span>
              </p>
              {billing.periodEnd && (
                <p className="text-sm text-muted-foreground">
                  {isCanceling ? "Access until" : "Renews on"}{" "}
                  {new Date(billing.periodEnd).toLocaleDateString()}
                </p>
              )}
              {isCanceling && (
                <p className="text-sm text-amber-600">
                  Your subscription will not renew. You can restore it from the
                  billing portal.
                </p>
              )}
            </div>
            <Button onClick={handleManageBilling} variant="outline">
              Manage Billing
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You are on the Free plan.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleUpgrade("starter")}
                variant="outline"
              >
                Upgrade to Starter
              </Button>
              <Button onClick={() => handleUpgrade("pro")}>
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
