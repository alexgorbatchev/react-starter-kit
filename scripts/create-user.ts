#!/usr/bin/env bun
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { configDotenv } from "dotenv";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function prompt(question: string): Promise<string> {
  const answer = await rl.question(question);
  return answer.trim();
}

async function promptPassword(question: string): Promise<string> {
  // A crude way to hide password input in node, it will intercept stdout write for this operation
  return new Promise((resolve) => {
    let password = "";
    process.stdout.write(question);

    const onData = (data: Buffer) => {
      const char = data.toString();
      if (char === "\n" || char === "\r" || char === "\u0004") {
        cleanup();
        process.stdout.write("\n");
        resolve(password);
      } else if (char === "\u0003") {
        // Ctrl+C
        cleanup();
        process.exit(1);
      } else if (char === "\b" || char === "\x7f") {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else {
        password += char;
        process.stdout.write("*");
      }
    };

    const cleanup = () => {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}

// Parse command line arguments
const { values } = parseArgs({
  options: {
    email: { type: "string" },
    password: { type: "string" },
    name: { type: "string" },
  },
  strict: false,
});

let { email, password, name } = values;

console.log("");
console.log("-----------------------------------------");
console.log("    Bootstrap: Create Admin User         ");
console.log("-----------------------------------------");

// Prompt for missing arguments interactively
if (!email) {
  email = await prompt("👉 Enter Email Address: ");
  if (!email) {
    console.error("❌ Email is required");
    process.exit(1);
  }
}

if (!name) {
  name = await prompt("👉 Enter Full Name: ");
  if (!name) {
    console.error("❌ Name is required");
    process.exit(1);
  }
}

if (!password) {
  password = await promptPassword("👉 Enter Password: ");
  if (!password || password.length < 8) {
    console.error("❌ Password must be at least 8 characters long");
    process.exit(1);
  }
}

rl.close();
console.log("");

// Load environment variables (.env.local -> .env)
configDotenv({ path: resolve(process.cwd(), ".env.local"), quiet: true });
configDotenv({ path: resolve(process.cwd(), ".env"), quiet: true });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required in .env.local",
  );
}

// Import better-auth createAuth using the db schema
import { createAuth } from "../apps/api/lib/auth";

const client = postgres(dbUrl, { max: 1 });
const db = drizzle(client, { casing: "snake_case" });

const envAuth = {
  ENVIRONMENT: "development",
  APP_NAME: "Example",
  APP_ORIGIN: "http://localhost:5173",
  BETTER_AUTH_SECRET:
    process.env.BETTER_AUTH_SECRET ||
    "fallback-secret-for-password-hash-only-1234567890",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID || "",
  STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID || "",
  STRIPE_PRO_ANNUAL_PRICE_ID: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || "",
};

interface IBetterAuthError {
  body?: {
    message?: string;
  };
}

// @ts-ignore
const auth = createAuth(db, envAuth);

console.log(`⏳ Creating user ${email}...`);

try {
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });
  console.log("✅ User created successfully!");
  console.log("-----------------------------------------");
  console.log(`Email:   ${result.user.email}`);
  console.log(`User ID: ${result.user.id}`);
  console.log("-----------------------------------------");
} catch (error) {
  // Try to parse better-auth API errors
  if (error && typeof error === "object" && "body" in error) {
    console.error(
      "❌ Registration failed:",
      (error as IBetterAuthError).body?.message || error,
    );
  } else {
    console.error("❌ Registration failed:");
    console.error(error);
  }
  process.exitCode = 1;
} finally {
  await client.end();
}
