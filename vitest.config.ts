import path from "node:path";
import { fileURLToPath } from "node:url";

import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: "./.cache/vite",
  test: {
    projects: [
      "apps/api",
      "apps/app",
      {
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright({}),
          },
          setupFiles: ["./apps/app/vitest.setup.ts"],
        },
        onConsoleLog(log, type) {
          if (type === "stderr") {
            const s = String(log);
            if (
              s.includes("The above error occurred in the") ||
              s.includes("React will try to recreate this component tree") ||
              s.includes(
                "Uncaught error: [Error: Storybook boundary test error.]",
              ) ||
              s.includes("Error caught by boundary:") ||
              s.includes("ThrowUnauthorizedError") ||
              s.includes("Unauthorized") ||
              s.includes("ThrowStoryError") ||
              s.includes("statusText") ||
              s.includes("401") ||
              s.includes("[Error: Storybook boundary test error.]")
            ) {
              return false;
            }
          }
        },
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            storybookScript: "bun run storybook",
            storybookUrl: "http://127.0.0.1:6006",
            tags: {
              skip: ["skip-test"],
            },
          }),
        ],
      },
    ],
  },
});
