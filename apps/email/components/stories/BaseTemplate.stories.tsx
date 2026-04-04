import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Heading, Text } from "@react-email/components";

import { BaseTemplate } from "../BaseTemplate";

const meta: Meta<typeof BaseTemplate> = {
  component: BaseTemplate,
  tags: ["skip-test"],
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    return (
      <BaseTemplate
        appName="React Starter Kit"
        appUrl="https://example.com"
        preview="Your weekly summary is ready"
      >
        <Heading as="h1">Weekly Summary</Heading>
        <Text>
          You shipped Storybook coverage for the shared UI components.
        </Text>
      </BaseTemplate>
    );
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.childElementCount).toBeGreaterThan(0);
  },
};

export { Default as BaseTemplate };
