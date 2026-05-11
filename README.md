# PlaySharp

PlaySharp is a monorepo for a training product focused on poker and blackjack.
The goal is to turn study into a daily habit with short interactive drills, instant feedback,
clear explanations, and visible progress tracking.

## Stack

- Web: Next.js + TypeScript
- API: NestJS + PostgreSQL + Prisma
- Package manager: npm workspaces

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Docker (recommended) or PostgreSQL 16+

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment files

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

Update `apps/api/.env` with local values. A working local example is:

```bash
DATABASE_URL="postgresql://playsharp:playsharp123@localhost:5432/playsharp?schema=public"
WEB_APP_URL="http://localhost:3000"
API_PORT=3001
JWT_SECRET="replace-this-with-at-least-32-random-characters"
```

Update `apps/web/.env.local` with:

```bash
API_BASE_URL="http://localhost:3001/api"
```

### 3. Start PostgreSQL

First run:

```bash
docker run --name playsharp-postgres \
  -e POSTGRES_USER=playsharp \
  -e POSTGRES_PASSWORD=playsharp123 \
  -e POSTGRES_DB=playsharp \
  -p 5432:5432 \
  -v playsharp_pgdata:/var/lib/postgresql/data \
  -d postgres:16
```

Next runs:

```bash
docker start playsharp-postgres
```

### 4. Initialize the database schema and seed

```bash
npm run prisma:generate --workspace @playsharp/api
npm run prisma:migrate --workspace @playsharp/api
npm run seed --workspace @playsharp/api
```

The repository ships committed Prisma migrations. Use `prisma:migrate` locally and
`prisma:deploy` in deployed environments.

### 5. Run the project

Start the full stack:

```bash
npm run dev
```

Run only the API:

```bash
npm run dev:api
```

Run only the web app:

```bash
npm run dev:web
```

To grant admin access to an existing account after it registers:

```bash
npm run admin:promote --workspace @playsharp/api -- --email you@example.com
```

Local URLs:

- Web app: `http://localhost:3000`
- API base URL: `http://localhost:3001/api`
- API health check: `http://localhost:3001/api/health`

Most web routes call the API directly, so in practice the frontend is only fully usable when
PostgreSQL and the API are both running.

### 6. Stop PostgreSQL

```bash
docker stop playsharp-postgres
```

## Main commands

- `npm run dev` - start the API and web app together
- `npm run dev:api` - start the API only
- `npm run dev:web` - start the web app only
- `npm run build` - build both workspaces
- `npm run admin:promote --workspace @playsharp/api -- --email you@example.com` - promote an existing user to admin
- `npm run seed --workspace @playsharp/api` - sync versioned content seed manifests into PostgreSQL
- `npm run smoke` - run post-build smoke checks for API health, core web routes, the quiz journey, and admin access control
- `npm run lint` - run ESLint across the repo
- `npm run typecheck` - run TypeScript checks across the workspaces
- `npm run format` - format the repository

Run `npm run build` before `npm run smoke`. The smoke runner starts the built API and web apps,
so it also needs a reachable PostgreSQL instance through the same `DATABASE_URL` used by the
API. It injects a smoke-only JWT secret by default; set `SMOKE_JWT_SECRET` to override it.
It validates guest routes, a register -> quiz -> lesson -> progress flow, and admin access rules for guest, user, and promoted admin accounts.

After editing files under `content/`, rerun `npm run seed --workspace @playsharp/api` so the
database stays aligned with the versioned seed manifests. CI now also runs `prisma:push` and
`seed` before smoke checks to catch content drift automatically.

## Repository layout

- `apps/web`: customer-facing web app
- `apps/api`: backend API
- `packages/shared`: shared types and constants
- `packages/ui`: reusable UI helpers and components
- `packages/config`: shared configuration presets
- `content`: versioned educational content seed manifests
- `docs`: product, UX, and data documentation

## Documentation

- `docs/README.md` - documentation map
- `docs/technical-setup.md` - development workflow and environment notes
- `docs/deployment-staging.md` - minimal staging and release checklist
- `docs/product/README.md` - product vision, V1 scope, and metrics
- `docs/product/roadmap.md` - delivery phases and current focus
- `docs/product/stories.md` - active unfinished product stories
- `docs/ux/frontend-guidelines.md` - UI tokens and interaction rules
- `docs/ux/screens.md` - target screen architecture
- `docs/data/database.md` - Prisma data model overview
- `docs/data/api-contract.md` - API envelope, route, and error contracts

## Current status

The repository now has a working V1 learning slice: auth, quiz attempt persistence, lesson and
progress flows, a protected admin content workspace, content validation, and seeded smoke
coverage. The next step is to keep hardening the experience and staging workflow rather than
filling basic scaffolding gaps.
