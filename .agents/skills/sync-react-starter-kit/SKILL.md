# Sync React Starter Kit Skill

This skill provides instructions for syncing changes from the upstream `react-starter-kit` repository into this project. The starting kit is periodically updated with new features, bug fixes, and better agent tooling.

The last synced commit SHA is stored in the `.react-starter-kit` file at the root of the project.

## Workflow

1.  **Check Sync Status**: Verify the current synced SHA.

    ```bash
    cat .react-starter-kit
    ```

2.  **Add/Fetch Upstream Remote**: If not already present, add the upstream remote and fetch the latest changes.

    ```bash
    git remote add starter-kit https://github.com/alexgorbatchev/react-starter-kit.git
    git fetch starter-kit
    ```

3.  **Determine Target SHA**: Find the target commit SHA in the upstream repository (e.g., `starter-kit/main`) that you want to sync up to.

4.  **Create a Patch**: Generate a diff between the last synced SHA (from `.react-starter-kit`) and the target SHA. Since you fetched the remote, you can do this directly in your local repository.

    ```bash
    LAST_SHA=$(cat .react-starter-kit)
    TARGET_SHA=$(git rev-parse starter-kit/main)
    git diff $LAST_SHA..$TARGET_SHA > /tmp/starter-kit-sync.patch
    ```

5.  **Apply the Patch**: Try to apply the patch using a 3-way merge.

    ```bash
    git apply --3way /tmp/starter-kit-sync.patch
    ```

6.  **Resolve Conflicts**:
    - Conflicts are common in configuration files like `package.json`, `vite.config.ts`, `AGENTS.md`, and `bun.lock`.
    - Look for standard git conflict markers (`<<<<<<< ours`, `=======`, `>>>>>>> theirs`).
    - **Crucial**: Carefully retain project-specific modifications. For instance, this project might use `@tailwindcss/vite` instead of `@tailwindcss/postcss`, or have custom `AGENTS.md` instructions.
    - Run `bun install` to regenerate `bun.lock` if `package.json` dependencies were modified.

7.  **Run Quality Checks**: After resolving conflicts, ensure the project builds and tests pass. Fix any TypeScript errors resulting from updated library types (e.g., `better-auth`).

    ```bash
    bun typecheck
    bun lint
    bun test --run
    ```

8.  **Update Tracking File**: Update the `.react-starter-kit` file with the new `TARGET_SHA`.

    ```bash
    echo $TARGET_SHA > .react-starter-kit
    git add .react-starter-kit
    ```

9.  **Commit Changes**: Create a single "drop commit" containing all the synced changes.

    ```bash
    git commit -m "chore: sync latest react-starter-kit updates

    Bring in changes from the upstream react-starter-kit repository up to commit $TARGET_SHA."
    ```
