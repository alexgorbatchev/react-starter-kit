#!/usr/bin/env bun

import { createAuth } from "@repo/api/auth";
import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { dirname, resolve } from "node:path";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

type AuthInstance = ReturnType<typeof createAuth>;
type CreateAuthEnv = Parameters<typeof createAuth>[1];
type PasswordPromptChunk = Buffer | string;

type CliOptions = {
  email?: string;
  help?: boolean;
  name?: string;
  password?: string;
};

export type CreateUserInput = {
  email: string;
  name: string;
  password: string;
};

export type CreatedUser = {
  email: string;
  id: string;
  name: string;
};

const CREATE_USER_USAGE = [
  "Usage:",
  '  bun create:user --email alice@example.com --name "Alice Example" --password "super-secret"',
  "  bun create:user",
  "",
  "Options:",
  "  --email       User email address",
  "  --name        User display name",
  "  --password    User password",
  "  --help        Show this help message",
  "",
  "Notes:",
  "  - Missing options fall back to interactive prompts when running in a TTY.",
  "  - ENVIRONMENT=staging|prod loads matching repo-root .env files.",
].join("\n");

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function createUser(
  auth: AuthInstance,
  input: CreateUserInput,
): Promise<CreatedUser> {
  const result = await auth.api.signUpEmail({
    body: {
      email: input.email,
      name: input.name,
      password: input.password,
    },
  });

  return {
    email: result.user.email,
    id: result.user.id,
    name: result.user.name,
  };
}

function getDatabaseEnvironmentName(): string {
  if (process.env.ENVIRONMENT) return process.env.ENVIRONMENT;
  if (process.env.NODE_ENV === "production") return "prod";
  if (process.env.NODE_ENV === "staging") return "staging";
  if (process.env.NODE_ENV === "test") return "test";
  return "dev";
}

function loadEnvironment(): void {
  const environmentName = getDatabaseEnvironmentName();

  for (const fileName of [
    `.env.${environmentName}.local`,
    ".env.local",
    ".env",
  ]) {
    configDotenv({ path: resolve(repositoryRoot, fileName), quiet: true });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (!/^postgre(s|sql):\/\/.+/.test(databaseUrl)) {
    throw new Error(
      "DATABASE_URL must be a valid PostgreSQL connection string",
    );
  }
}

function getAppEnvironment(): CreateAuthEnv["ENVIRONMENT"] {
  const environmentName = process.env.ENVIRONMENT ?? process.env.NODE_ENV;

  if (environmentName === "prod" || environmentName === "production") {
    return "production";
  }

  if (environmentName === "staging") {
    return "staging";
  }

  if (environmentName === "preview") {
    return "preview";
  }

  return "development";
}

function getRequiredEnvironmentValue(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

function getAuthEnvironment(): CreateAuthEnv {
  return {
    ENVIRONMENT: getAppEnvironment(),
    APP_NAME: process.env.APP_NAME ?? "Example",
    APP_ORIGIN: process.env.APP_ORIGIN ?? "http://localhost:5173",
    BETTER_AUTH_SECRET: getRequiredEnvironmentValue("BETTER_AUTH_SECRET"),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
    RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM ?? "",
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID,
    STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
    STRIPE_PRO_ANNUAL_PRICE_ID: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  };
}

function parseCliOptions(): CliOptions {
  const { values } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      email: { type: "string" },
      help: { type: "boolean" },
      name: { type: "string" },
      password: { type: "string" },
    },
    strict: true,
  });

  return values;
}

function normalizeRequiredValue(value: string, label: string): string {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    throw new Error(`${label} is required`);
  }
  return normalizedValue;
}

function getMissingOptions(options: CliOptions): string[] {
  const missingOptions: string[] = [];

  if (!options.email) {
    missingOptions.push("--email");
  }

  if (!options.name) {
    missingOptions.push("--name");
  }

  if (!options.password) {
    missingOptions.push("--password");
  }

  return missingOptions;
}

async function prompt(question: string): Promise<string> {
  const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    return (await lineReader.question(question)).trim();
  } finally {
    lineReader.close();
  }
}

async function promptPassword(question: string): Promise<string> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return prompt(question);
  }

  return new Promise((resolve, reject) => {
    let password = "";

    const cleanup = (): void => {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    const onData = (chunk: PasswordPromptChunk): void => {
      const input = chunk.toString();

      if (input === "\u0003") {
        cleanup();
        reject(new Error("User cancelled password entry"));
        return;
      }

      if (input === "\r" || input === "\n" || input === "\u0004") {
        cleanup();
        process.stdout.write("\n");
        resolve(password);
        return;
      }

      if (input === "\b" || input === "\x7f") {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write("\b \b");
        }
        return;
      }

      password += input;
      process.stdout.write("*");
    };

    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}

async function resolveCreateUserInput(
  options: CliOptions,
): Promise<CreateUserInput> {
  const missingOptions = getMissingOptions(options);

  if (missingOptions.length > 0 && !process.stdin.isTTY) {
    throw new Error(
      `Missing required options in non-interactive mode: ${missingOptions.join(", ")}`,
    );
  }

  const emailValue = options.email ?? (await prompt("Email: "));
  const nameValue = options.name ?? (await prompt("Name: "));
  const passwordValue =
    options.password ?? (await promptPassword("Password: "));

  if (!passwordValue) {
    throw new Error("Password is required");
  }

  return {
    email: normalizeRequiredValue(emailValue, "Email"),
    name: normalizeRequiredValue(nameValue, "Name"),
    password: passwordValue,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(error: unknown): string {
  if (isRecord(error)) {
    const body = error.body;
    if (isRecord(body) && typeof body.message === "string") {
      return body.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function main(): Promise<void> {
  const options = parseCliOptions();

  if (options.help) {
    console.log(CREATE_USER_USAGE);
    return;
  }

  loadEnvironment();

  const databaseUrl = getRequiredEnvironmentValue("DATABASE_URL");
  const input = await resolveCreateUserInput(options);
  const client = postgres(databaseUrl, { max: 1 });

  try {
    const db = drizzle(client, { casing: "snake_case" });
    const auth = createAuth(db, getAuthEnvironment());
    const user = await createUser(auth, input);

    console.log("✅ User created successfully");
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.name}`);
  } finally {
    await client.end();
  }
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    console.error(`❌ ${getErrorMessage(error)}`);
    process.exitCode = 1;
  }
}
