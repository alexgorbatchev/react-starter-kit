---
name: check-upstream
description: Check whether the current GitHub fork has upstream commits that can be merged or synced into the fork, and list the upstream-only commits. Use when asked whether a fork is behind upstream, whether there is anything new to merge from the parent repo, or whether a repo needs an upstream sync check.
---

# Check Upstream

Use this skill to answer fork-sync questions with evidence instead of guessing from local remotes.

## Workflow

1. Run `bun .agents/skills/check-upstream/scripts/checkUpstream.ts --json` from the repo root.
2. Read `status`, `aheadBy`, `behindBy`, and `syncMode`.
3. Report the result:
   - `identical`: fork and upstream match; nothing to merge.
   - `ahead`: fork has unique commits; no upstream commits are waiting.
   - `behind`: upstream has new commits; the fork can be fast-forwarded or synced.
   - `diverged`: upstream has new commits, but the fork also has unique commits; merging or rebasing needs review.
4. If `upstreamCommits` is non-empty, list the commit SHAs, dates, and subjects.

## Command Options

- `--fork <owner/repo|git-url>`: override the fork repo instead of reading `origin`
- `--upstream <owner/repo|git-url>`: override the GitHub parent repo
- `--fork-branch <branch>`: compare a non-default fork branch
- `--upstream-branch <branch>`: compare a non-default upstream branch
- `--limit <n>`: cap the listed upstream commits; default is `20`
- `--json`: print machine-readable output for agent use

## Notes

- The script uses the GitHub parent relationship, so it still works when the local `upstream` remote is missing.
- If the repo is not a GitHub fork, pass `--upstream` explicitly.
- Do not infer sync status from timestamps or remote names alone; always compare refs.
