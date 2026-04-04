import { fileURLToPath } from "node:url";
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
    const { default: tsconfigPaths } = await import(
      fileURLToPath(
        new URL(
          "../node_modules/vite-tsconfig-paths/dist/index.js",
          import.meta.url,
        ),
      )
    );

    return {
      ...config,
      define: {
        ...config.define,
        "import.meta.env.VITE_APP_NAME": JSON.stringify(
          process.env.VITE_APP_NAME ?? "React Starter Kit",
        ),
      },
      plugins: [
        ...(config.plugins ?? []),
        tsconfigPaths({
          projects: [
            fileURLToPath(
              new URL("../apps/app/tsconfig.json", import.meta.url),
            ),
            fileURLToPath(
              new URL("../packages/ui/tsconfig.json", import.meta.url),
            ),
            fileURLToPath(
              new URL("../apps/email/tsconfig.json", import.meta.url),
            ),
          ],
        }),
      ],
    };
  },
};

export default config;
