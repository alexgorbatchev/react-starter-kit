import { defineConfig } from "oxfmt";
import createOxfmtConfig from "@alexgorbatchev/typescript-ai-policy/oxfmt-config";

const baseConfig = createOxfmtConfig(() => ({
  ignorePatterns: [
    "app/queries/**",
    "*/dist/**",
    "**/*.generated.ts",
    "**/*.gen.ts",
    ".cache/**",
    "node_modules/**",
    "bun.lock",
    "tsconfig.base.json",
    ".husky/**",
    "**/*.hbs",
  ],
  overrides: [
    {
      files: ["*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
  ],
}));

export default defineConfig({
  ...baseConfig,
  printWidth: 80,
});
