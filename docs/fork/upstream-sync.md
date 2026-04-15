# Upstream Sync

Because this project is a fork of `react-starter-kit`, it's important to periodically sync updates from the upstream repository to bring in new features, bug fixes, and agent tooling improvements.

We provide two specialized AI agent skills to handle this process seamlessly.

## Check Upstream Skill

The `check-upstream` skill allows you (or an AI agent) to check if your fork is behind the upstream repository, and lists the upstream-only commits.

```bash
bun .agents/skills/check-upstream/scripts/checkUpstream.ts
```

You can pass the `--json` flag to print machine-readable output for agent use. It determines if the local fork and upstream match (`identical`), if the fork has unique commits (`ahead`), if upstream has new commits waiting to be merged (`behind`), or if both have unique commits (`diverged`).

## Sync React Starter Kit Skill

When you want to pull the latest changes, the `sync-react-starter-kit` skill automates the syncing workflow.

The last synced commit SHA is stored in the `.react-starter-kit` file at the root of the project. The typical workflow executed by the agent includes:

1. **Adding/Fetching the Upstream Remote**:
   ```bash
   git remote add starter-kit https://github.com/alexgorbatchev/react-starter-kit.git
   git fetch starter-kit
   ```
2. **Creating a Patch**: It calculates the diff between the last synced SHA and the target upstream SHA.
3. **Applying the Patch**: Using a 3-way merge (`git apply --3way`).
4. **Resolving Conflicts**: The agent will carefully retain project-specific modifications in configuration files like `package.json`, `vite.config.ts`, `AGENTS.md`, and `bun.lock`.
5. **Running Quality Checks**: The agent will run `bun typecheck`, `bun lint`, and `bun test --run` to ensure the project remains stable.
6. **Updating Tracking**: The `.react-starter-kit` file is updated with the new `TARGET_SHA`.

If you ever want an agent to sync your fork with upstream, simply instruct it to use the **sync-react-starter-kit** skill.
