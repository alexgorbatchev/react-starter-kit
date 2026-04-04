/**
 * @file Better Auth client instance.
 *
 * Do not use auth.useSession() directly - use TanStack Query wrappers
 * from lib/queries/session.ts to ensure proper caching and consistency.
 */

import { passkeyClient } from "@better-auth/passkey/client";
import { stripeClient } from "@better-auth/stripe/client";
import {
  anonymousClient,
  emailOTPClient,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { authConfig } from "./auth-config";

const DEFAULT_AUTH_ORIGIN = "http://localhost:5173";

export function getAuthBaseUrl(origin: string | undefined): string {
  if (origin?.startsWith("http://") || origin?.startsWith("https://")) {
    return origin + authConfig.api.basePath;
  }

  return DEFAULT_AUTH_ORIGIN + authConfig.api.basePath;
}

const baseURL = getAuthBaseUrl(
  typeof window !== "undefined" ? window.location.origin : undefined,
);

export const auth = createAuthClient({
  baseURL,
  plugins: [
    anonymousClient(),
    emailOTPClient(),
    organizationClient(),
    passkeyClient(),
    stripeClient({ subscription: true }),
  ],
});

export type AuthClient = typeof auth;

// Inferred types from configured instance - includes plugin extensions
// $Infer.Session is the full response shape { user, session }
type SessionResponse = typeof auth.$Infer.Session;
export type User = SessionResponse["user"];
export type Session = SessionResponse["session"];
