---
url: /react-starter-kit/fork/pre-commit-checks.md
---
# Pre-Commit Checks

This fork enforces strict quality standards via Husky pre-commit hooks. Before any commit is allowed, the following commands are run locally:

* `bun typecheck` - Validates TypeScript types across the monorepo.
* `bun test --run` - Runs the unified Vitest test suite.

If either of these fail, the commit will be rejected. Agents should be aware of this and ensure they run these commands to verify their changes locally before attempting to commit.
