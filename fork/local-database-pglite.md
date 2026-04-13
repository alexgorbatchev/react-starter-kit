---
url: /react-starter-kit/fork/local-database-pglite.md
---
# Local Database with PGLite

To simplify local development and avoid the need for running a full PostgreSQL server (via Docker, Postgres.app, or Homebrew), this fork utilizes [PGlite](https://pglite.dev/) (`@electric-sql/pglite`) for local database storage.

## How it Works

PGlite is an embedded PostgreSQL engine that runs directly in Node.js/Bun. It writes database files to the local file system.

In this project, the local database is stored in the `.tmp/pglite` directory at the root of the workspace.

### Configuration

1. **Environment Variables**: The `.env` file configures the `DATABASE_URL` to point to the local `.tmp/pglite` directory instead of a standard `postgres://` connection string.

   ```env
   DATABASE_URL=.tmp/pglite
   ```

2. **Drizzle Config**: `db/drizzle.config.ts` detects if the `DATABASE_URL` is a PGLite path (not starting with `postgres://`) and automatically switches the Drizzle dialect driver to `pglite`. It also resolves the `.tmp/pglite` path relative to the project root.

3. **API Development Server**: `apps/api/dev.ts` has been updated so that when running the local dev server (`bun dev`), it connects to the PGLite database using the `@electric-sql/pglite` client and passes that instance to the tRPC context. This bypasses the default behavior which attempts to connect to Cloudflare Hyperdrive.

4. **Seeding**: `db/scripts/seed.ts` automatically parses the non-postgres connection string and uses the PGLite client to run seed scripts correctly.

## Usage

You can interact with the local PGLite database using the standard `db` package scripts from the root of the project:

* **Push schema changes:**
  ```bash
  bun db:push
  ```
* **Seed the database:**
  ```bash
  bun db:seed
  ```
* **Run the local dev server** (which will automatically use the PGLite database):
  ```bash
  bun dev
  ```

## Troubleshooting

* **Resetting the Database**: If you need to completely wipe your local database, you can simply delete the `.tmp/pglite` directory and re-run the push and seed commands.

  ```bash
  rm -rf .tmp/pglite
  bun db:push
  bun db:seed
  ```

* **Cloudflare Deployments**: PGLite is only used for local development. When deployed, the workers will still use the `DATABASE_URL` to connect to Neon PostgreSQL via Cloudflare Hyperdrive, as the deployed environments use the values injected in `.dev.vars` or the Wrangler bindings.
