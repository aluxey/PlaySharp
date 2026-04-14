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
JWT_SECRET="replace-me"
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
npm run prisma:push --workspace @playsharp/api
npm run seed --workspace @playsharp/api
```

The repository currently does not ship a committed Prisma migration, so `prisma db push`
is the right local setup command before seeding.

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
- `npm run seed --workspace @playsharp/api` - sync versioned content into PostgreSQL
- `npm run smoke` - run post-build smoke checks for API health, core web routes, and the quiz journey
- `npm run lint` - run ESLint across the repo
- `npm run typecheck` - run TypeScript checks across the workspaces
- `npm run format` - format the repository

Run `npm run build` before `npm run smoke`. The smoke runner starts the built API and web apps,
so it also needs a reachable PostgreSQL instance through the same `DATABASE_URL` used by the
API. It validates guest routes plus a register -> quiz -> lesson -> progress flow.

After editing files under `content/`, rerun `npm run seed --workspace @playsharp/api` so the
database stays aligned with the versioned manifests. CI now also runs `prisma:push` and `seed`
before smoke checks to catch content drift automatically.

## Repository layout

- `apps/web`: customer-facing web app
- `apps/api`: backend API
- `packages/shared`: shared types and constants
- `packages/ui`: reusable UI helpers and components
- `packages/config`: shared configuration presets
- `content`: versioned educational content
- `docs`: product, UX, and data documentation

## Documentation

- `docs/technical-setup.md`
- `docs/deployment-staging.md`
- `docs/product/vision.md`
- `docs/product/roadmap.md`
- `docs/ux/frontend-guidelines.md`
- `docs/ux/screens.md`
- `docs/data/database.md`
- `docs/data/api-contract.md`

## Current status

The repository has a working technical baseline: monorepo tooling, scaffolded apps, shared
packages, and the first product routes. The next step is to connect auth, data, and the quiz
engine.
