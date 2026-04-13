import { spawn } from "node:child_process";

async function main() {
  const isAgent = process.env.AGENT === "1";
  const useDocker = process.env.AGENT_RUNTIME === "docker";

  if (!isAgent) {
    console.log("Running standard dev environment...");
    const proc = spawn(
      "bun",
      [
        "--parallel",
        "--filter",
        "@repo/web",
        "--filter",
        "@repo/api",
        "--filter",
        "@repo/app",
        "dev",
      ],
      { stdio: "inherit", env: process.env },
    );
    proc.on("exit", (code) => process.exit(code ?? 0));
    process.on("SIGINT", () => {
      proc.kill("SIGINT");
    });
    return;
  }

  if (useDocker) {
    console.log("Running Agent dev environment (Docker mode)...");
    const proc = spawn("bun", ["run", "./scripts/dev-agent-docker.ts"], {
      stdio: "inherit",
      env: process.env,
    });
    proc.on("exit", (code) => process.exit(code ?? 0));
    process.on("SIGINT", () => {
      proc.kill("SIGINT");
    });
  } else {
    console.log("Running Agent dev environment (Local mode)...");
    const proc = spawn("bun", ["run", "./scripts/dev-agent-proxy.ts"], {
      stdio: "inherit",
      env: process.env,
    });
    proc.on("exit", (code) => process.exit(code ?? 0));
    process.on("SIGINT", () => {
      proc.kill("SIGINT");
    });
  }
}

main().catch(console.error);
