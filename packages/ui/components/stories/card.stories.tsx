import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

const meta: Meta<typeof Card> = {
  title: "@repo/ui/components/card",
  component: Card,
  render: () => {
    return (
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Team plan</CardTitle>
          <CardDescription>
            Review the current subscription details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            5 seats · Active · Renews on December 31
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Manage billing</Button>
        </CardFooter>
      </Card>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Team plan")).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Manage billing" }),
    ).toBeInTheDocument();
  },
};

export { Default as Card };
