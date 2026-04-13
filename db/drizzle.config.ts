import { configDotenv } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { resolve } from "node:path";
import * as fs from "node:fs";

// Environment detection: ENVIRONMENT var takes priority, then NODE_ENV mapping
const envName = (() => {
  if (process.env.ENVIRONMENT) return process.env.ENVIRONMENT;
  if (process.env.NODE_ENV === "production") return "prod";
  if (process.env.NODE_ENV === "staging") return "staging";
  if (process.env.NODE_ENV === "test") return "test";
  return "dev";
})();

// Load .env files in priority order: environment-specific → local → base
for (const file of [`.env.${envName}.local`, ".env.local", ".env"]) {
  configDotenv({ path: resolve(__dirname, "..", file), quiet: true });
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Validate DATABASE_URL format
const isPgLite = !/^postgre(s|sql):\/\/.+/.test(process.env.DATABASE_URL);

let dbUrl = process.env.DATABASE_URL;
if (isPgLite) {
  // Resolve relative to project root
  dbUrl = resolve(__dirname, "..", dbUrl);
  fs.mkdirSync(dbUrl, { recursive: true });
}

/**
 * Drizzle ORM configuration for Neon PostgreSQL database
 *
 * @see https://orm.drizzle.team/docs/drizzle-config-file
 * @see https://orm.drizzle.team/llms.txt
 */
export default defineConfig({
  out: "./migrations",
  schema: "./schema",
  dialect: "postgresql",
  ...(isPgLite ? { driver: "pglite" } : {}),
  casing: "snake_case",
  dbCredentials: {
    url: dbUrl,
  },
});
