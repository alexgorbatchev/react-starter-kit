---
url: /react-starter-kit/fork/agent-development.md
---
# AI Agent Development Flow

This fork of React Starter Kit includes a specialized development environment designed to make it safe, fast, and completely collision-free for multiple autonomous AI agents to work on and test the codebase simultaneously.

## The Problem

When multiple agents or parallel processes try to run `bun dev` to verify their code changes:

1. They often collide on default static ports (e.g., `5173`, `8787`).
2. If left running indefinitely, these preview servers waste system resources and create orphaned processes.
3. Agents often don't know how to gracefully tear down the development environment after verification.

## The Solution

We replaced the standard `bun dev` command with a smart orchestration script. It behaves normally for human developers, but unlocks specialized superpowers when invoked by an AI agent.

### 1. Normal Development (Human)

```bash
bun dev
```

For a human developer, this behaves exactly as expected. It binds to the static ports defined in your `.env` file (`5173` for Vite, `8787` for Hono, etc.) and keeps the server running until you manually stop it with `Ctrl+C`.

### 2. Agent Development (Proxy Mode)

```bash
AGENT=1 bun dev
```

When an agent sets `AGENT=1`:

* **Dynamic Port Allocation:** The script dynamically finds 4 random, available open ports on the host system to run the API, App, and Web workers.
* **Reverse Proxy:** It spins up a single entry-point reverse proxy (also on a random open port) that maps everything together exactly as Cloudflare Workers would.
* **Inactivity Timeout:** It tracks HTTP traffic hitting the proxy. If 30 seconds pass without any new network requests, the proxy cleanly shuts down all child processes and exits with `code 0`.

This makes it extremely safe for agents to spawn preview servers and verify their HTTP responses without leaving messy zombie processes on your machine.

### 3. Agent Development (Docker Mode)

```bash
AGENT=1 AGENT_RUNTIME=docker bun dev
```

Sometimes agents need complete filesystem isolation or they might accidentally kill a background process they shouldn't.

By setting `AGENT_RUNTIME=docker` alongside `AGENT=1`:

* A fully isolated `node:22-bookworm` Docker container is spun up.
* The `node_modules` from your host macOS/Windows machine are explicitly excluded to ensure the Linux container downloads the correct native binaries for tools like `esbuild` and `workerd`.
* Code changes in `src/` directories are mapped live, so the agent can still make code modifications and instantly see the results in the Dockerized preview server.
* The same 30-second inactivity timeout runs inside the container. Once it shuts down, a host script automatically tears down the container and network volumes to leave zero trace.

## Environment Variables Configuration

These behaviors can be permanently toggled in your `.env` file instead of passing them inline:

```env
# Enable dynamic port assignment and 30s auto-shutdown
AGENT=1

# Run the agent server inside an isolated Docker container
AGENT_RUNTIME=docker
```
