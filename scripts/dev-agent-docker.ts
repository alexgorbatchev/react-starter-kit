import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

async function getAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, () => {
      const addr = server.address();
      server.close(() => {
        if (typeof addr === "object" && addr !== null) {
          resolve(addr.port);
        } else {
          reject(new Error("Could not get port"));
        }
      });
    });
  });
}

async function main() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const safeName = pkg.name
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/^-+|-+$/g, "");

  const proxyPort = await getAvailablePort();
  const projectName = `${safeName}-${proxyPort}`;

  const proc = spawn(
    "docker",
    [
      "compose",
      "-p",
      projectName,
      "-f",
      "docker-compose.agent.yml",
      "up",
      "--build",
      "--abort-on-container-exit",
    ],
    {
      env: {
        ...process.env,
        PROXY_PORT: proxyPort.toString(),
      },
      stdio: "inherit",
    },
  );

  const cleanup = () => {
    console.log(`\nCleaning up Docker resources...`);
    spawn(
      "docker",
      [
        "compose",
        "-p",
        projectName,
        "-f",
        "docker-compose.agent.yml",
        "down",
        "-v",
      ],
      {
        stdio: "inherit",
      },
    );
  };

  proc.on("exit", () => {
    cleanup();
  });

  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
}

main().catch(console.error);
