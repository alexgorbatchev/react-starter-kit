# Pre-Commit Checks

This fork enforces strict quality standards via Husky pre-commit hooks. Before any commit is allowed, the following commands are run locally:

- `bun x lint-staged` - Formats staged JavaScript, TypeScript, and JSON files with `oxfmt` and lints staged JavaScript and TypeScript files with `oxlint`.
- `bun run typecheck` - Validates TypeScript types across the monorepo.

If either command fails, the commit will be rejected. The canonical formatter config lives in `oxfmt.config.ts`; do not reintroduce a parallel `.oxfmtrc.*` file.
