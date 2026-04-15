# ONBOARD

Read this before building new features.

This file explains how to turn a starter repository into a truthful project repository. It is intentionally product-agnostic. The goal is not to invent the product here. The goal is to remove template residue so the codebase, docs, and instructions stop lying about what the repository is.

## Goal

Before normal feature work starts, make the repository true in six areas:

- Identity: names, links, branding, and metadata describe the current project.
- Product surface: visible routes, navigation, and emails are real, not demo content.
- Runtime configuration: domains, worker names, env defaults, and deploy settings are intentional.
- Instructions: README, contribution docs, agent instructions, and docs site agree with each other.
- Optional subsystems: starter features are explicitly kept, replaced, quarantined, or removed.
- Verification: the canonical dev, lint, typecheck, test, and build commands still work after cleanup.

## Operating Rule

For every starter artifact, choose exactly one outcome:

- Keep: it is part of the real project and you are willing to own it now.
- Replace: the pattern is useful, but the current content is boilerplate.
- Remove: it is not part of the project and should not survive adoption.

Do not leave starter artifacts in a half-owned state.

## Recommended Order

1. Rewrite identity.
2. Remove or rewrite demo product surfaces.
3. Replace placeholder runtime and deployment configuration.
4. Align human and agent instructions.
5. Decide which starter subsystems remain.
6. Run the full verification baseline.

## 1. Identity

Start here because everything else depends on it.

- Replace starter names in visible UI, docs, metadata, and generated content.
- Remove template-specific links, sponsor sections, community references, assistant links, and repository URLs that point to the seed project.
- Replace placeholder app names, origins, and public URLs.
- Rewrite the top-level README so it explains this repository as it exists today, not how to create a repo from the original template.
- Update package descriptions, Storybook defaults, and email branding so screenshots, previews, and package metadata stop leaking template identity.

If a new engineer lands in the repository and still sees the starter name first, adoption is not done.

## 2. Product Surface

The repository is not adopted until the visible product stops looking like a demo.

- Remove or rewrite fake dashboards, sample metrics, demo tables, example users, placeholder reports, and template about pages.
- Remove navigation items that lead to demo-only or unfinished areas.
- Replace sample content with either real product flows or intentionally empty states.
- Do not keep public routes whose backing logic is still placeholder-only.
- Audit emails, Storybook stories, and fixtures for visible starter branding and example domains.

Do not start shipping features on top of demo UI. It turns every later task into cleanup plus feature work.

## 3. Runtime and Configuration

Starter kits often work technically while still pointing at fake names and example infrastructure.

- Replace placeholder domains, worker names, service bindings, app names, and deployment URLs.
- Audit `.env`, environment examples, Wrangler config, CI deploy metadata, docs config, and local dev defaults.
- Keep only the environment variables for systems you actually use now.
- If a subsystem is optional, make that explicit in docs and config instead of leaving it as implied boilerplate.
- Verify that local development, preview environments, and production configuration tell the same story.

Configuration drift is one of the fastest ways to make onboarding inaccurate.

## 4. Docs and Instructions

The repository needs one coherent set of instructions for both humans and coding agents.

- Make the README the truthful project entry point.
- Rewrite contribution docs so they describe the actual branch, commit, and verification workflow.
- Tighten `AGENTS.md` so it reflects current repo boundaries, commands, and non-obvious rules.
- Keep maintenance-only instructions separate from day-one onboarding. Upstream sync notes belong in maintenance docs, not in the main project introduction.
- Make sure docs site pages, local docs, and agent instructions agree on commands and expectations.

If two docs disagree, the repository is not ready for efficient work.

## 5. Optional Subsystems

Starter repositories usually ship more surface area than the project needs on day one.

- Decide explicitly whether auth, billing, organizations, docs site, Storybook, email, analytics, background jobs, realtime, and infrastructure modules are in scope now.
- If a subsystem stays, verify it and own it.
- If a subsystem is useful later but not now, quarantine it behind clear docs and avoid linking to it from primary product flows.
- If a subsystem is not part of the project, delete it instead of carrying permanent template debt.

Unused starter features are not neutral. They create false requirements, false routing, and false confidence.

## 6. Verification Baseline

After cleanup, re-establish the smallest trustworthy baseline.

- Install dependencies from a clean checkout.
- Run the canonical dev command and confirm the repo boots with its current defaults.
- Run the canonical lint, typecheck, test, and build commands.
- Open the main app and inspect the visible navigation and default screens.
- Confirm there is no starter branding in the first-run experience.
- Confirm there are no reachable routes backed by TODO-only logic.
- Confirm docs and config point to real project names, domains, and remotes.

Do not move into feature delivery until this baseline is green.

## Current Repo Hotspots

These are the highest-value places to adapt first in this repository.

### Identity and Top-Level Docs

- `README.md`
- `.github/CONTRIBUTING.md`
- `docs/index.md`
- `docs/getting-started/quick-start.md`
- `docs/.vitepress/config.ts`

Use this group to remove template branding, template repository links, sponsor/community references, and template-first setup language.

### Runtime and Deployment Placeholders

- `.env`
- `apps/api/wrangler.jsonc`
- `apps/app/wrangler.jsonc`
- `apps/web/wrangler.jsonc`
- `.github/workflows/ci.yml`

Use this group to replace placeholder app names, worker names, local origins, deployment URLs, and example domains.

### Demo UI and Navigation

- `apps/app/components/pages/AboutPage.tsx`
- `apps/app/components/pages/DashboardPage.tsx`
- `apps/app/components/pages/UsersPage.tsx`
- `apps/app/components/pages/ReportsPage.tsx`
- `apps/app/components/pages/AnalyticsPage.tsx`
- `apps/app/components/layout/constants.ts`
- `apps/app/routes/(app)/*`

Use this group to remove demo pages, fake metrics, sample user tables, template messaging, and navigation entries that imply product areas you do not yet own.

### Placeholder Backend Domains

- `apps/api/routers/organization.ts`
- `apps/api/routers/user.ts`

These are starter scaffolds with TODO-backed behavior. Either implement them for real or remove them from any public or documented flow.

### Branded Templates and Previews

- `apps/email/components/BaseTemplate.tsx`
- `apps/email/emails/*.tsx`
- `apps/email/templates/stories/*.tsx`
- `.storybook/main.ts`
- `packages/ui/package.json`

Use this group to replace starter names, example URLs, and default app metadata that leak into emails, stories, and package surfaces.

### Maintenance-Only Fork Material

- `docs/fork/upstream-sync.md`
- `docs/fork/agent-development.md`
- `.react-starter-kit`
- `.agents/skills/sync-react-starter-kit/`

Keep this material only if upstream maintenance is still a deliberate workflow. If it stays, treat it as maintenance documentation, not as the project's core identity.

## Recommended First Pass For This Repo

1. Rewrite top-level identity and onboarding docs.
2. Remove or hide demo pages and demo navigation.
3. Replace placeholder configuration and deployment metadata.
4. Decide whether organization and user starter scaffolds are real near-term scope.
5. Rebrand email and Storybook surfaces.
6. Re-run the verification baseline.
7. Only then begin normal feature implementation.

## Done Means

The repository is adopted when all of the following are true:

- A new engineer can understand what the repo is without seeing starter branding first.
- No visible route or doc page exists only to advertise the starter kit.
- Placeholder domains, names, and deployment targets are gone from active config.
- Human docs and agent docs agree on how to work in the repo.
- Remaining starter subsystems are intentionally owned, not accidentally inherited.
- The standard verification commands succeed after the cleanup pass.

## Final Step

Once the repository has fully absorbed the guidance in this file and the adoption work is complete, delete `ONBOARDING.md` and remove references to `ONBOARDING.md` from `AGENTS.md`.

This file is meant to help a repository stop being a starter kit. It should not become permanent starter-kit residue itself.
