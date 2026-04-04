---
review_sha: 06188825c1bc6f1739e9ca6c1a4ecf3299934493
reviewed_at: 2026-03-31T00:30:41Z
---

# Review Summary

- Findings: critical=3, moderate=4, minor=1
- Coverage: unavailable (`vitest --coverage` fails because `@vitest/coverage-v8` is not installed; target: 90%)
- Test status: pass (`bun run test --run`); `bun run lint`, `bun run typecheck`, and `bun run build` also passed

# Project Review Runbook

- Last verified at: 2026-03-31T00:30:41Z (06188825c1bc6f1739e9ca6c1a4ecf3299934493)
- Setup/install commands:
  - `bun install`
  - `cp .env .env.local`
- Test commands:
  - `bun run test --run`
  - `bun run test --project @repo/api --run`
  - `bun run test --project @repo/app --run`
- Coverage commands:
  - `bun run test --run --coverage` ← currently fails: missing `@vitest/coverage-v8`
- Build/typecheck/lint commands (if applicable):
  - `bun run build`
  - `bun run typecheck`
  - `bun run lint`
- Required env/services/fixtures:
  - Root `.env*` must provide `APP_NAME`, `APP_ORIGIN`, `API_ORIGIN`, `GOOGLE_CLOUD_PROJECT`, and `GA_MEASUREMENT_ID` for the verified app/web builds.
  - API dev/deploy also needs `DATABASE_URL`, Hyperdrive bindings, `BETTER_AUTH_SECRET`, and the email/OAuth/billing secrets you actually enable.
  - `pg_dump` is required for `bun db:export`; Terraform + Cloudflare credentials are required for `infra/*` commands.
- Monorepo/package working-directory notes:
  - Run commands from the repo root.
  - Use `bun run test ...`, not Bun's builtin `bun test`, for the Vitest workspace.
- Known caveats:
  - Coverage is currently unavailable because the Vitest coverage provider dependency is missing.
  - The infrastructure docs currently describe only one Hyperdrive output even though the API worker config declares two Hyperdrive bindings.

# Findings by Category

## Correctness Bugs

- None.

## Security Issues

- None.

## Project-Specific Policy Violations (always critical)

### [REV-001] [critical] Cached/direct Hyperdrive contract is broken between API docs, worker config, and Terraform

- Location: `apps/api/AGENTS.md:9`, `apps/api/wrangler.jsonc:24`, `apps/api/worker.ts:23`, `infra/modules/cloudflare/hyperdrive/main.tf:33`, `infra/stacks/edge/outputs.tf:18`, `infra/README.md:54`
- Current behavior: The API layer documents and declares two distinct Hyperdrive bindings (`HYPERDRIVE_CACHED` for reads and `HYPERDRIVE_DIRECT` for writes), but Terraform provisions only one Hyperdrive resource, disables caching on it, and exposes only a single `hyperdrive_id` output.
- Expected behavior: Infrastructure must provision both sides of the documented topology (cached + direct) and publish both IDs so `apps/api/wrangler.jsonc` can be configured consistently with the worker contract.
- Why it matters: This violates the documented database architecture in `apps/api/AGENTS.md` and makes the deployment instructions internally inconsistent. A reviewer or operator cannot reproduce the intended runtime shape from the repo as-is, and any deployment that duplicates the single ID into both bindings silently loses the advertised cached/direct split.

### [REV-002] [critical] Better Auth is wired to the cached database binding instead of the documented direct writer path

- Location: `apps/api/AGENTS.md:9`, `apps/api/worker.ts:43` (`worker` middleware), `apps/api/dev.ts:54` (dev middleware)
- Current behavior: Both the production worker and the local dev server create `db` from `HYPERDRIVE_CACHED`, create `dbDirect` from `HYPERDRIVE_DIRECT`, and then instantiate Better Auth with `createAuth(db, ...)`, i.e. the cached handle.
- Expected behavior: Auth flows should use the non-cached writer connection (or an explicit split strategy) because they create sessions, revoke sessions, update passkeys, and otherwise mutate security-sensitive state.
- Why it matters: The project policy in `apps/api/AGENTS.md` explicitly says `db` is for reads and `dbDirect` is for writes/transactions. Violating that rule on the auth boundary risks stale auth reads and inconsistent session behavior if a real cached Hyperdrive binding is ever provisioned.

### [REV-003] [critical] Public tRPC endpoints fabricate success instead of persisting data or failing loudly

- Location: `apps/api/routers/organization.ts:4` (`organizationRouter`), `apps/api/routers/user.ts:14` (`userRouter.updateProfile`, `userRouter.list`), policy source `AGENTS.md` (“Fail loudly in core logic. Do not silently swallow errors or mask incorrect state.”)
- Current behavior: Organization endpoints return placeholder arrays, timestamp-based fake IDs, echoed input, and unconditional success responses; `user.updateProfile` and `user.list` do the same. None of those procedures touch the database.
- Expected behavior: These procedures must either implement the real database-backed behavior or throw an explicit not-implemented error until the feature exists.
- Why it matters: The current code lies to callers about state changes. That is exactly the class of masked incorrect state the root `AGENTS.md` forbids, and it creates user-visible data loss because clients can believe an organization, invite, or profile change succeeded when nothing was actually stored.

## Cross-Component Contract Misalignment

### [REV-004] [moderate] Web worker route allowlist is out of sync with the SPA route tree

- Location: `apps/web/worker.ts:26`, `apps/app/components/layout/constants.ts:6`, `apps/app/routes/(app)/users.tsx:20`, `apps/app/routes/(app)/dashboard.tsx:3`, `apps/app/routes/(app)/about.tsx:12`
- Current behavior: The web worker forwards only `/_app/*`, `/login*`, `/signup*`, `/settings*`, `/analytics*`, and `/reports*` to the app worker, then sends every other path to the marketing-site assets. The SPA itself declares additional app routes such as `/users`, `/dashboard`, and `/about`, and `/users` is linked from the sidebar.
- Expected behavior: The edge router and the SPA route tree must share the same route contract, either by forwarding all non-marketing app paths or by generating the allowlist from a single source of truth.
- Why it matters: Direct navigation or refresh on `/users` falls through to the marketing worker instead of the app worker, so a linked app page is not reliably addressable. `/dashboard` and the app-only `/about` route drift for the same reason, which makes deep links and hard refreshes unreliable.

### [REV-005] [moderate] Optional Google and Stripe integrations are still treated as mandatory UI capabilities

- Location: `README.md:139`, `README.md:146`, `.env:57`, `apps/api/lib/env.ts:9`, `apps/api/lib/auth.ts:43`, `apps/api/lib/auth.ts:169`, `apps/app/components/auth/auth-form.tsx:176`, `apps/app/routes/(app)/settings.tsx:146`
- Current behavior: The docs describe Stripe billing as optional and OAuth providers as “as needed”, but the Bun-side env schema hard-requires Google/OpenAI secrets, the auth config always defines Google as a social provider, the login form always renders the Google button, and the settings page always offers Stripe upgrade/portal actions even when `stripePlugin()` returns `[]`.
- Expected behavior: Optional integrations should be capability-gated consistently: optional secrets should be optional in the schema, and UI affordances should only render when the backend has the corresponding provider/plugin configured.
- Why it matters: Non-Google or non-Stripe deployments inherit broken behavior instead of graceful degradation. Depending on which path is exercised, maintainers either get failing Bun-side tooling or end users get auth/billing actions that can only fail at runtime.

### [REV-006] [moderate] Coverage is advertised and scripted, but the repository cannot actually produce a coverage report

- Location: `apps/app/package.json:11` (`coverage`), `apps/web/pages/features.astro:103`
- Current behavior: The repo advertises “Vitest setup with coverage reporting” and ships a `vitest --coverage` script, but `bun run test --run --coverage` currently fails with `Cannot find dependency '@vitest/coverage-v8'`.
- Expected behavior: The workspace should include the required Vitest coverage provider and a working project-level coverage command, or the claim/script should be removed until it works.
- Why it matters: Reviewers cannot measure the stated 90% target, and maintainers have no functioning coverage gate to detect regression in untested areas.

## Stub Implementations

- None beyond [REV-003].

## Unfinished Features

- None beyond [REV-003] and [REV-005].

## Dead Code

### [REV-007] [minor] Several exported scaffolds are not wired into any runtime path

- Location: `packages/core/index.ts:7`, `apps/api/package.json:24`, `apps/app/lib/store.ts:9`, `apps/api/lib/loaders.ts:43`, `apps/api/lib/ai.ts:14`
- Current behavior: `@repo/core` is an empty package that is still declared as an API dependency; `StoreProvider` creates a Jotai store but is never mounted; the request-scoped DataLoader helpers and `getOpenAI()` helper are defined but have no in-repo callers.
- Expected behavior: Remove placeholder exports and unused dependencies, or wire them into real flows with tests and documentation.
- Why it matters: These files expand the apparent architecture without providing behavior. That increases review and maintenance cost because future contributors have to inspect layers that do not participate in the running system.

## Optimization Opportunities

- None.

## File Size and Modularity

- None.

## API and Design Gaps (libraries only)

- Not applicable: this repository is primarily an application/monorepo template.

# Test Results

- Commands run:
  - `bun run test --run`
  - `bun run lint`
  - `bun run typecheck`
  - `bun run build`
  - `bun run test --run --coverage`
- Result:
  - `bun run test --run`: passed (4 files, 37 tests)
  - `bun run lint`: passed
  - `bun run typecheck`: passed
  - `bun run build`: passed
  - `bun run test --run --coverage`: failed before producing coverage output
- Failures:
  - Coverage command failed with `Cannot find dependency '@vitest/coverage-v8'`.
  - Exploratory `bun test --run` hit Bun's builtin runner rather than Vitest and is not the correct workspace test command for this repo.

# Test Coverage

- Overall: Coverage unavailable
- Target: 90%
- Below-target areas: Unable to measure because the configured coverage flow does not run
- If unavailable: "Coverage unavailable: `bun run test --run --coverage` fails because `@vitest/coverage-v8` is not installed."

# Issue Lifecycle (incremental reviews)

- First review — no prior issue lifecycle.
