import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { createProxyServer } from "http-proxy";

const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || "30000", 10);

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
  console.log("Finding available ports...");
  const apiPort = await getAvailablePort();
  const appPort = await getAvailablePort();
  const webPort = await getAvailablePort();
  const proxyPort = process.env.PROXY_PORT
    ? parseInt(process.env.PROXY_PORT, 10)
    : await getAvailablePort();

  console.log(
    `Assigned ports: API=${apiPort}, APP=${appPort}, WEB=${webPort}, PROXY=${proxyPort}`,
  );

  const env = {
    ...process.env,
    APP_ORIGIN: `http://localhost:${appPort}`,
    API_ORIGIN: `http://localhost:${apiPort}`,
    PUBLIC_APP_ORIGIN: `http://localhost:${appPort}`,
  };

  // Spawn API
  const apiProc = spawn(
    "bun",
    [
      "run",
      "--watch",
      "--env-file",
      "../../.env",
      "--env-file",
      "../../.env.local",
      "./dev.ts",
    ],
    {
      cwd: "apps/api",
      env: { ...env, PORT: apiPort.toString() },
      stdio: "inherit",
    },
  );

  // Spawn App
  const appProc = spawn(
    "bun",
    ["run", "vite", "serve", "--port", appPort.toString(), "--strictPort"],
    {
      cwd: "apps/app",
      env,
      stdio: "inherit",
    },
  );

  // Spawn Web
  const webProc = spawn(
    "bun",
    ["run", "astro", "dev", "--port", webPort.toString()],
    {
      cwd: "apps/web",
      env: { ...env, PORT: webPort.toString() },
      stdio: "inherit",
    },
  );

  const procs = [apiProc, appProc, webProc];

  let lastActive = Date.now();

  const proxy = createProxyServer({
    target: `http://localhost:${appPort}`,
    changeOrigin: true,
    ws: true,
  });

  proxy.on("error", () => {
    // Ignore proxy errors to not crash the script
  });

  const server = createServer((req, res) => {
    lastActive = Date.now();
    proxy.web(req, res);
  });

  server.on("upgrade", (req, socket, head) => {
    lastActive = Date.now();
    proxy.ws(req, socket, head);
  });

  server.listen(proxyPort, () => {
    console.log(
      `\n=============================================================`,
    );
    console.log(
      `🚀 Agent Dev Server running at: http://localhost:${proxyPort}`,
    );
    console.log(
      `⏰ Auto-shutdown configured for ${TIMEOUT_MS / 1000}s of inactivity.`,
    );
    console.log(
      `=============================================================\n`,
    );
  });

  const interval = setInterval(() => {
    if (Date.now() - lastActive > TIMEOUT_MS) {
      console.log(
        `\n=============================================================`,
      );
      console.log(
        `🛑 Server shutting down due to ${TIMEOUT_MS / 1000}s of inactivity.`,
      );
      console.log(`🔄 You can start it again if necessary.`);
      console.log(
        `=============================================================\n`,
      );

      clearInterval(interval);
      server.close();
      procs.forEach((p) => p.kill());
      process.exit(0);
    }
  }, 1000);

  process.on("SIGINT", () => {
    procs.forEach((p) => p.kill());
    process.exit(0);
  });
}

main().catch(console.error);
