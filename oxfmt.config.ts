import createOxfmtConfig from "@alexgorbatchev/typescript-ai-policy/oxfmt-config";

export default createOxfmtConfig(() => ({
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
}));
