import { execa } from "execa";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { EOL } from "node:os";

// Create Git-ignored files for environment variable overrides
if (!existsSync("./.env.local")) {
  await writeFile(
    "./.env.local",
    [
      `# Overrides for the \`.env\` file in the root folder.`,
      "#",
      "# CLOUDFLARE_API_TOKEN=xxxxx",
      "#",
      "",
      "API_URL=http://localhost:8080",
      "",
    ].join(EOL),
    "utf-8",
  );
}

try {
  await execa("bun", ["run", "tsgo", "--build"], { stdin: "inherit" });
} catch (error) {
  console.warn(
    "Post-install type build failed. Run `bun typecheck` for details.",
  );
  console.warn(error);
}
