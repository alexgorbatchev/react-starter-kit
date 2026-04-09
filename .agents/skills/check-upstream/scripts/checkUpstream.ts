#!/usr/bin/env bun
import { parseArgs } from "node:util";

interface IParsedRepo {
  owner: string;
  name: string;
  nameWithOwner: string;
}

interface IRepoMetadata {
  defaultBranch: string;
  isFork: boolean;
  nameWithOwner: string;
  parentNameWithOwner: string | null;
}

type ComparisonStatus = "ahead" | "behind" | "diverged" | "identical";
type SyncMode = "none" | "fast-forward" | "merge-required";

interface IComparisonSummary {
  aheadBy: number;
  behindBy: number;
  mergeBaseSha: string;
  status: ComparisonStatus;
}

interface IUpstreamCommit {
  date: string;
  message: string;
  sha: string;
  url: string;
}

interface ICheckUpstreamResult {
  aheadBy: number;
  behindBy: number;
  fork: string;
  forkBranch: string;
  hasUpstreamCommits: boolean;
  mergeBaseSha: string;
  status: ComparisonStatus;
  syncMode: SyncMode;
  upstream: string;
  upstreamBranch: string;
  upstreamCommits: IUpstreamCommit[];
}

const textDecoder = new TextDecoder();
const DEFAULT_LIMIT = 20;

function main(): void {
  const { values } = parseArgs({
    options: {
      fork: { type: "string" },
      "fork-branch": { type: "string" },
      help: { type: "boolean" },
      json: { type: "boolean" },
      limit: { type: "string" },
      upstream: { type: "string" },
      "upstream-branch": { type: "string" },
    },
    strict: true,
  });

  if (values.help) {
    printHelp();
    return;
  }

  const limit = readLimit(values.limit);
  const forkRepo = values.fork
    ? parseRepoSpecifier(values.fork)
    : readOriginRepo();
  const forkMetadata = readRepoMetadata(forkRepo);

  const upstreamRepo = values.upstream
    ? parseRepoSpecifier(values.upstream)
    : readImplicitUpstreamRepo(forkMetadata);

  const upstreamMetadata = readRepoMetadata(upstreamRepo);
  const forkBranch = values["fork-branch"] ?? forkMetadata.defaultBranch;
  const upstreamBranch =
    values["upstream-branch"] ?? upstreamMetadata.defaultBranch;

  const comparison = readComparisonSummary({
    forkBranch,
    forkRepo,
    upstreamBranch,
    upstreamRepo,
  });

  const upstreamCommits =
    comparison.behindBy > 0
      ? readUpstreamCommits({
          limit,
          mergeBaseSha: comparison.mergeBaseSha,
          upstreamBranch,
          upstreamRepo,
        })
      : [];

  const result: ICheckUpstreamResult = {
    aheadBy: comparison.aheadBy,
    behindBy: comparison.behindBy,
    fork: forkRepo.nameWithOwner,
    forkBranch,
    hasUpstreamCommits: comparison.behindBy > 0,
    mergeBaseSha: comparison.mergeBaseSha,
    status: comparison.status,
    syncMode: determineSyncMode(comparison),
    upstream: upstreamRepo.nameWithOwner,
    upstreamBranch,
    upstreamCommits,
  };

  if (values.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  printHumanSummary(result);
}

function printHelp(): void {
  console.log(`checkUpstream.ts

Usage:
  bun .agents/skills/check-upstream/scripts/checkUpstream.ts [options]

Options:
  --fork <owner/repo|git-url>        Override the fork repo (default: origin remote)
  --upstream <owner/repo|git-url>    Override the upstream repo (default: GitHub parent)
  --fork-branch <branch>             Override the fork branch (default: fork default branch)
  --upstream-branch <branch>         Override the upstream branch (default: upstream default branch)
  --limit <n>                        Limit listed upstream commits (default: ${DEFAULT_LIMIT})
  --json                             Print machine-readable JSON
  --help                             Show this help
`);
}

function readLimit(rawLimit: string | undefined): number {
  if (!rawLimit) {
    return DEFAULT_LIMIT;
  }

  const parsedLimit = Number.parseInt(rawLimit, 10);
  if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
    throw new Error(`Invalid --limit value: ${rawLimit}`);
  }

  return parsedLimit;
}

function readOriginRepo(): IParsedRepo {
  const remoteUrl = runCommand(["git", "remote", "get-url", "origin"]);
  return parseRepoSpecifier(remoteUrl);
}

function parseRepoSpecifier(value: string): IParsedRepo {
  const normalizedValue = value
    .trim()
    .replace(/^git@github\.com:/u, "")
    .replace(/^https?:\/\/github\.com\//u, "")
    .replace(/\.git$/u, "");

  const match = normalizedValue.match(
    /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/u,
  );
  if (!match) {
    throw new Error(`Unsupported GitHub repo specifier: ${value}`);
  }

  const owner = match[1];
  const name = match[2];

  return {
    name,
    nameWithOwner: `${owner}/${name}`,
    owner,
  };
}

function readRepoMetadata(repo: IParsedRepo): IRepoMetadata {
  const output = runCommand([
    "gh",
    "repo",
    "view",
    repo.nameWithOwner,
    "--json",
    "defaultBranchRef,isFork,nameWithOwner,parent",
    "-q",
    '[.defaultBranchRef.name, (.isFork | tostring), .nameWithOwner, (if .parent then (.parent.owner.login + "/" + .parent.name) else "" end)] | @tsv',
  ]);

  const [defaultBranch, isFork, nameWithOwner, parentNameWithOwner] =
    output.split("\t");

  if (!defaultBranch || !isFork || !nameWithOwner) {
    throw new Error(`Unexpected gh repo view output for ${repo.nameWithOwner}`);
  }

  return {
    defaultBranch,
    isFork: isFork === "true",
    nameWithOwner,
    parentNameWithOwner: parentNameWithOwner || null,
  };
}

function readImplicitUpstreamRepo(forkMetadata: IRepoMetadata): IParsedRepo {
  if (!forkMetadata.isFork || !forkMetadata.parentNameWithOwner) {
    throw new Error(
      `Repo ${forkMetadata.nameWithOwner} is not a GitHub fork. Pass --upstream explicitly.`,
    );
  }

  return parseRepoSpecifier(forkMetadata.parentNameWithOwner);
}

interface IReadComparisonSummaryInput {
  forkBranch: string;
  forkRepo: IParsedRepo;
  upstreamBranch: string;
  upstreamRepo: IParsedRepo;
}

function readComparisonSummary(
  input: IReadComparisonSummaryInput,
): IComparisonSummary {
  const comparisonSpec = `${input.upstreamRepo.owner}:${input.upstreamBranch}...${input.forkRepo.owner}:${input.forkBranch}`;
  const output = runCommand([
    "gh",
    "api",
    `repos/${input.forkRepo.nameWithOwner}/compare/${comparisonSpec}`,
    "--jq",
    "[.status, (.ahead_by | tostring), (.behind_by | tostring), .merge_base_commit.sha] | @tsv",
  ]);

  const [status, aheadBy, behindBy, mergeBaseSha] = output.split("\t");

  if (!isComparisonStatus(status) || !aheadBy || !behindBy || !mergeBaseSha) {
    throw new Error(`Unexpected compare output for ${comparisonSpec}`);
  }

  return {
    aheadBy: Number.parseInt(aheadBy, 10),
    behindBy: Number.parseInt(behindBy, 10),
    mergeBaseSha,
    status,
  };
}

function isComparisonStatus(
  value: string | undefined,
): value is ComparisonStatus {
  return (
    value === "ahead" ||
    value === "behind" ||
    value === "diverged" ||
    value === "identical"
  );
}

interface IReadUpstreamCommitsInput {
  limit: number;
  mergeBaseSha: string;
  upstreamBranch: string;
  upstreamRepo: IParsedRepo;
}

function readUpstreamCommits(
  input: IReadUpstreamCommitsInput,
): IUpstreamCommit[] {
  const jqQuery = `.commits[:${input.limit}][] | [.sha, (.commit.committer.date // ""), (.commit.message | split("\\n")[0] | gsub("\\t"; " ")), .html_url] | @tsv`;
  const output = runCommand([
    "gh",
    "api",
    `repos/${input.upstreamRepo.nameWithOwner}/compare/${input.mergeBaseSha}...${input.upstreamBranch}`,
    "--jq",
    jqQuery,
  ]);

  if (!output) {
    return [];
  }

  return output.split("\n").flatMap((line) => {
    if (!line.trim()) {
      return [];
    }

    const [sha, date, message, url] = line.split("\t");
    if (!sha || !message || !url) {
      throw new Error(`Unexpected upstream commit output line: ${line}`);
    }

    return [{ date: date ?? "", message, sha, url }];
  });
}

function determineSyncMode(comparison: IComparisonSummary): SyncMode {
  if (comparison.behindBy === 0) {
    return "none";
  }

  if (comparison.aheadBy === 0) {
    return "fast-forward";
  }

  return "merge-required";
}

function printHumanSummary(result: ICheckUpstreamResult): void {
  console.log(`Fork: ${result.fork} (${result.forkBranch})`);
  console.log(`Upstream: ${result.upstream} (${result.upstreamBranch})`);
  console.log(
    `Status: ${result.status} | ahead: ${result.aheadBy} | behind: ${result.behindBy}`,
  );
  console.log(`Sync mode: ${result.syncMode}`);

  if (!result.hasUpstreamCommits) {
    console.log("No upstream commits are waiting to be merged into the fork.");
    return;
  }

  console.log("Upstream commits available to merge:");
  result.upstreamCommits.forEach((commit) => {
    const shortSha = commit.sha.slice(0, 8);
    const datePrefix = commit.date ? `${commit.date} ` : "";
    console.log(`- ${shortSha} ${datePrefix}${commit.message}`);
  });
}

function runCommand(command: string[]): string {
  const commandResult = Bun.spawnSync({
    cmd: command,
    stderr: "pipe",
    stdout: "pipe",
  });

  const stdout = textDecoder.decode(commandResult.stdout).trim();
  const stderr = textDecoder.decode(commandResult.stderr).trim();
  const exitCode = commandResult.exitCode ?? 1;

  if (exitCode !== 0) {
    const renderedCommand = command.join(" ");
    const renderedError =
      stderr || stdout || `Command failed with exit code ${exitCode}`;
    throw new Error(`${renderedCommand}: ${renderedError}`);
  }

  return stdout;
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`check-upstream failed: ${message}`);
  process.exit(1);
}
