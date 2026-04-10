import { createAuth } from "@repo/api/auth";
import type { DB } from "better-auth/adapters/drizzle";
import {
  getAuthTables,
  type BetterAuthDBSchema,
  type DBFieldAttribute,
} from "better-auth/db";

type AuthInstance = ReturnType<typeof createAuth>;
type AuthOptions = Parameters<typeof getAuthTables>[0];
type CreateAuthEnv = Parameters<typeof createAuth>[1];

type AuthSchemaField = {
  references?: {
    field: string;
    model: string;
  };
  required: boolean;
  type: DBFieldAttribute["type"];
  unique: boolean;
};

type AuthSchemaTable = {
  fields: Record<string, AuthSchemaField>;
  modelName: string;
};

type AuthSchemaOutput = {
  metadata: {
    description: string;
    generatedAt: string;
    tableCount: number;
  };
  tables: Record<string, AuthSchemaTable>;
};

type AuthWithOptions = AuthInstance & {
  options: AuthOptions;
};

const mockDb: DB = {};
const mockAuthEnvironment: CreateAuthEnv = {
  ENVIRONMENT: "development",
  APP_NAME: "React Starter Kit",
  APP_ORIGIN: "http://localhost:3000",
  BETTER_AUTH_SECRET: "mock-secret-with-at-least-thirty-two-characters",
  GOOGLE_CLIENT_ID: "mock-google-client-id",
  GOOGLE_CLIENT_SECRET: "mock-google-client-secret",
  RESEND_API_KEY: "mock-resend-api-key",
  RESEND_EMAIL_FROM: "noreply@example.com",
  STRIPE_SECRET_KEY: undefined,
  STRIPE_WEBHOOK_SECRET: undefined,
  STRIPE_STARTER_PRICE_ID: undefined,
  STRIPE_PRO_PRICE_ID: undefined,
  STRIPE_PRO_ANNUAL_PRICE_ID: undefined,
};

function hasOptions(auth: AuthInstance): auth is AuthWithOptions {
  return "options" in auth;
}

function formatField(field: DBFieldAttribute): AuthSchemaField {
  if (field.references) {
    return {
      references: {
        field: field.references.field,
        model: field.references.model,
      },
      required: field.required ?? false,
      type: field.type,
      unique: field.unique ?? false,
    };
  }

  return {
    required: field.required ?? false,
    type: field.type,
    unique: field.unique ?? false,
  };
}

function formatTable(table: BetterAuthDBSchema[string]): AuthSchemaTable {
  const fields: Record<string, AuthSchemaField> = {};

  for (const [fieldKey, field] of Object.entries(table.fields)) {
    fields[fieldKey] = formatField(field);
  }

  return {
    fields,
    modelName: table.modelName,
  };
}

export async function generateAuthSchema(): Promise<AuthSchemaOutput> {
  const auth = createAuth(mockDb, mockAuthEnvironment);

  if (!hasOptions(auth)) {
    throw new Error("Better Auth instance does not expose options");
  }

  const tables = getAuthTables(auth.options);
  const formattedTables: Record<string, AuthSchemaTable> = {};

  for (const [tableKey, table] of Object.entries(tables)) {
    formattedTables[tableKey] = formatTable(table);
  }

  return {
    metadata: {
      description: "Better Auth database schema",
      generatedAt: new Date().toISOString(),
      tableCount: Object.keys(tables).length,
    },
    tables: formattedTables,
  };
}

async function main(): Promise<void> {
  try {
    const schema = await generateAuthSchema();
    console.log(JSON.stringify(schema, null, 2));
  } catch (error) {
    console.error("Error generating auth schema:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
