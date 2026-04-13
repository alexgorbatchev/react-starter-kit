import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: [
    "../apps/app/components/**/stories/*.stories.@(ts|tsx)",
    "../apps/app/stories/*.stories.@(ts|tsx)",
    "../apps/email/**/stories/*.stories.@(ts|tsx)",
    "../packages/ui/components/stories/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-vitest"],
  staticDirs: ["../apps/app/public"],
  async viteFinal(config) {
    return {
      ...config,
      define: {
        ...config.define,
        "import.meta.env.VITE_APP_NAME": JSON.stringify(
          process.env.VITE_APP_NAME ?? "React Starter Kit",
        ),
      },
      resolve: {
        ...config.resolve,
        tsconfigPaths: true,
      },
    };
  },
};

export default config;
