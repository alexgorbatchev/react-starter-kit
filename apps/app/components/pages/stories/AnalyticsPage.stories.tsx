import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AnalyticsPage } from "../AnalyticsPage";

const meta: Meta<typeof AnalyticsPage> = {
  component: AnalyticsPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Analytics" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("/dashboard")).toBeInTheDocument();
  },
};

export { Default as AnalyticsPage };
