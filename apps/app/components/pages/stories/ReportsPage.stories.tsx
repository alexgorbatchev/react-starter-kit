import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { ReportsPage } from "../ReportsPage";

const meta: Meta<typeof ReportsPage> = {
  component: ReportsPage,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const reportTypeSelect = canvas.getByRole("combobox", {
      name: "Report type",
    });
    const dateRangeSelect = canvas.getByRole("combobox", {
      name: "Date range",
    });

    await userEvent.click(reportTypeSelect);
    await userEvent.click(body.getByRole("option", { name: "Analytics" }));
    await expect(
      canvas.getByRole("combobox", { name: "Report type" }),
    ).toHaveTextContent("Analytics");

    await userEvent.click(dateRangeSelect);
    await userEvent.click(body.getByRole("option", { name: "Last 30 days" }));
    await expect(
      canvas.getByRole("combobox", { name: "Date range" }),
    ).toHaveTextContent("Last 30 days");

    await expect(
      canvas.getByRole("button", { name: "Download Monthly Sales Report" }),
    ).toBeEnabled();
    await expect(
      canvas.getByRole("button", { name: "Download Financial Summary" }),
    ).toBeDisabled();
  },
};

export { Default as ReportsPage };
