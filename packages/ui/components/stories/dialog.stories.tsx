import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";

const meta: Meta<typeof Dialog> = {
  title: "@repo/ui/components/dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  render: () => {
    return (
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workspace</DialogTitle>
            <DialogDescription>
              This action removes all members and can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      body.getByRole("dialog", { name: "Delete workspace" }),
    ).toBeInTheDocument();
    await expect(
      body.getByRole("button", { name: "Delete" }),
    ).toBeInTheDocument();
  },
};

export { Default as Dialog };
