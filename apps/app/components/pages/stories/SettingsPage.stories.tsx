import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import {
  activeStarterBilling,
  authenticatedSession,
} from "../../../stories/AppStoryDecorator";
import { SettingsPage } from "../SettingsPage";

const meta: Meta<typeof SettingsPage> = {
  component: SettingsPage,
  parameters: {
    appStory: {
      billing: activeStarterBilling,
      session: authenticatedSession,
    },
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByRole("textbox", { name: "Name" });
    const emailNotifications = canvas.getByRole("switch", {
      name: "Email Notifications",
    });
    const darkMode = canvas.getByRole("switch", { name: "Dark Mode" });

    await userEvent.type(nameInput, "Alex Example");
    await expect(nameInput).toHaveValue("Alex Example");

    await expect(emailNotifications).not.toBeChecked();
    await userEvent.click(emailNotifications);
    await expect(emailNotifications).toBeChecked();

    await expect(darkMode).not.toBeChecked();
    await userEvent.click(darkMode);
    await expect(darkMode).toBeChecked();
  },
};

export { Default as SettingsPage };
