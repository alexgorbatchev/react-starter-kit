#!/usr/bin/env bun
// Usage: bun scripts/seed.ts [--env ENVIRONMENT=staging|prod]

import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePgLite } from "drizzle-orm/pglite";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";
import { seedUsers } from "../seeds/users";
import { resolve } from "node:path";

// Import drizzle config to trigger environment loading
import "../drizzle.config";

const isPgLite = !/^postgre(s|sql):\/\/.+/.test(process.env.DATABASE_URL!);

type DbClient = { close?: () => Promise<void>; end?: () => Promise<void> };

let db: Parameters<typeof seedUsers>[0];
let client: DbClient;

if (isPgLite) {
  const dbUrl = resolve(__dirname, "../..", process.env.DATABASE_URL!);
  const pgliteClient = new PGlite(dbUrl);
  client = pgliteClient;
  db = drizzlePgLite(pgliteClient, {
    schema,
    casing: "snake_case",
  }) as unknown as Parameters<typeof seedUsers>[0];
} else {
  const pgClient = postgres(process.env.DATABASE_URL!, { max: 1 });
  client = pgClient;
  db = drizzle(pgClient, { schema, casing: "snake_case" });
}

console.log("🌱 Starting database seeding...");

try {
  await seedUsers(db);
  console.log("✅ Database seeding completed successfully!");
} catch (error) {
  console.error("❌ Database seeding failed:");
  console.error(error);
  process.exitCode = 1;
} finally {
  if (isPgLite) {
    await client.close?.();
  } else {
    await client.end?.();
  }
}
