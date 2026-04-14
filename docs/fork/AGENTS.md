# Agent Instructions: Fork Specifics

This folder (`docs/fork/`) contains documentation specific to this fork of the `react-starter-kit`. 

## Instructions for Agents

1. **GitHub Pages & Infrastructure Details:** Do not document infrastructure-specific changes like GitHub Pages deployments (e.g., `.github/workflows/docs-pages.yml`) into the fork documentation. These are infrastructure-specific changes and we do not need to include them in the `docs/fork/` area.
2. **Log Streaming:** The `bun dev` command has been modified to run via `scripts/dev.ts`. When running the standard dev environment (not in agent proxy mode), it uses `bun --parallel` under the hood. Be aware that this changes how logs are streamed to the console, interleaving the logs with prefixes for each workspace (`@repo/web`, `@repo/api`, `@repo/app`).
3. **Agent Development Environment:** You should utilize the agent-specific environment flags `AGENT=1` (or `AGENT=1 AGENT_RUNTIME=docker`) when starting local dev servers to prevent port collisions.
4. **Upstream Syncing:** When merging changes from the parent repository, strictly use the `sync-react-starter-kit` and `check-upstream` skills. 
5. **Docs Exclusion:** This `AGENTS.md` file is explicitly excluded from the VitePress documentation build via the `srcExclude` setting. Do not add it to the VitePress sidebar.