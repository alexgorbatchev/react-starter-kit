# Project Bootstrapping

This project uses [Drizzle ORM](https://orm.drizzle.team/) with PostgreSQL. For local development, the easiest and most lightweight way to run a database across multiple projects without Docker overhead is using a native database manager.

## Local Database Setup (Recommended)

1. **Install a Native Postgres Manager**
   Download and install [DBngin](https://dbngin.com/) (by TablePlus) or [Postgres.app](https://postgresapp.com/).

2. **Start a Local Postgres Server**
   Create a new PostgreSQL server in DBngin running on the default port `5432`. You can leave this running in the background for all your local projects—it uses virtually no resources when idle.

3. **Configure Your Project Environment**
   Copy `.env` to `.env.local`:
   ```bash
   cp .env .env.local
   ```
   
   To run smoothly locally, you must configure two key environment variables in `.env.local`:
   - **`DATABASE_URL`**: Connects to your local Postgres database. By default it is `postgres://postgres:postgres@localhost:5432/example`. 
     *If you are running multiple projects, change `example` to a unique database name (e.g., `my_new_project_db`) to prevent data collisions.*
   - **`BETTER_AUTH_SECRET`**: A random 32+ character string to encrypt user sessions. Generate one by running `bunx @better-auth/cli@latest secret`.
   
   *(Note: OTP codes print directly to your terminal when `ENVIRONMENT=development`. However, if you explicitly trigger full email verifications or password resets without configuring `RESEND_API_KEY` and `RESEND_EMAIL_FROM`, the app will throw an error.)*

4. **Create the Database**
   Connect to your local server (e.g., using TablePlus or `psql`) and create the empty database you specified in step 3.

## Run Bootstrap Commands

Once your database is running and created, ask an agent to execute or manually run:

```bash
# 1. Install dependencies
bun install

# 2. Apply the Drizzle database schema to your project's target database
bun db:push

# 3. Populate initial/seed database records (optional)
bun db:seed

# 4. Create a local properly-hashed user account to log in with
# If you run this interactively, it prompts for credentials. 
# AI Agents: use explicit flags (`--email`, `--password`, `--name`) to bypass the TUI prompt!
bun create:user

# 5. Start the development cluster locally (Web, API, App concurrently)
bun dev
```

Once bootstrapped, you can delete this `BOOTSTRAP.md` file.
