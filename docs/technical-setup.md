# Technical Setup

## What the stack uses

- **Web**: Next.js 16, React 19, TypeScript
- **API**: NestJS 11, TypeScript, Prisma
- **Database**: PostgreSQL
- **Package manager**: npm workspaces
- **Shared code**: `packages/shared`, `packages/ui`, `packages/config`

## What you need installed

- Node.js 20 or newer
- npm 10 or newer
- PostgreSQL 16 or newer, local or remote

## Project layout

- `apps/web`: customer-facing app
- `apps/api`: backend API and Prisma schema
- `packages/*`: shared code and config
- `content`: versioned educational content seed manifests
- `docs`: product, UX, data, and technical documentation

## Local setup

The README is the quickstart source of truth. This page keeps the details that are useful once the
basic setup is already understood.

1. Install dependencies from the repository root.

```bash
npm install
```

2. Create the environment files.

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

3. Update the API values in `apps/api/.env`.

- `DATABASE_URL`: points to your PostgreSQL database
- `WEB_APP_URL`: used by the API CORS setup
- `API_PORT`: defaults to `3001`
- `JWT_SECRET`: required by the API, at least 32 characters, and must not be a placeholder

4. Update the web value in `apps/web/.env.local`.

- `API_BASE_URL`: API base URL, usually `http://localhost:3001/api`

5. Create the database.

Use an existing PostgreSQL instance or create a new database named `playsharp`.

6. Prepare Prisma and seed the initial data.

```bash
npm run prisma:generate --workspace @playsharp/api
npm run prisma:migrate --workspace @playsharp/api
npm run seed --workspace @playsharp/api
```

7. Start the project.

```bash
npm run dev
```

## Running the apps

- Web app: `http://localhost:3000`
- API health check: `http://localhost:3001/api/health`

If you want to run only one app:

```bash
npm run dev:web
npm run dev:api
```

## Useful scripts

- `npm run build` - builds both workspaces
- `npm run lint` - checks code quality
- `npm run typecheck` - checks TypeScript across the monorepo
- `npm test` - runs workspace tests
- `npm run content:check` - validates content manifests through the API workspace
- `npm run smoke` - runs post-build smoke checks
- `npm run format` - formats all files
- `npm run format:check` - verifies formatting without changing files

## Current implementation notes

- The web app uses the App Router and now covers the main V1 screens, including auth, quiz,
  lessons, progress, profile, and admin content workspace routes.
- The API exposes health, auth, quiz, progress, profile, content, lesson completion, and admin
  content management contracts.
- The Prisma schema lives in `apps/api/prisma/schema.prisma`.
- Database migrations live in `apps/api/prisma/migrations`.
- The `content` folder is the versioned seed and review format for educational content.

## Typical workflow

1. Update or add content in `content/`.
2. Run `npm run content:check`.
3. Rerun `npm run seed --workspace @playsharp/api` so PostgreSQL matches the manifests.
4. Build the corresponding web page or API module.
5. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before merging.

## Notes

- Premium, Stripe, and social features are intentionally deferred.
- Keep the README and this document as the source of truth for local onboarding.
