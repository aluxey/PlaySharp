# Technical Setup

## What the stack uses

- **Web**: Next.js 15, React 19, TypeScript
- **API**: NestJS 10, TypeScript, Prisma
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
- `content`: versioned educational content
- `docs`: product, UX, data, and technical documentation

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Create the environment files.

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

3. Update the values in `apps/api/.env`.

- `DATABASE_URL`: points to your PostgreSQL database
- `WEB_APP_URL`: used by the API CORS setup
- `API_BASE_URL`: used by the web app to read content and quiz data from the API
- `API_PORT`: defaults to `3001`
- `JWT_SECRET`: replace the placeholder before real auth work

4. Create the database.

Use an existing PostgreSQL instance or create a new database named `playsharp`.

5. Prepare Prisma and seed the initial data.

```bash
npm run prisma:generate --workspace @playsharp/api
npm run prisma:migrate --workspace @playsharp/api
npm run seed --workspace @playsharp/api
```

6. Start the project.

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
- `npm run format` - formats all files
- `npm run format:check` - verifies formatting without changing files

## Current implementation notes

- The web app uses the App Router and currently exposes scaffolded routes for the V1 screens.
- The API currently exposes a health endpoint and module boundaries for future domains.
- The Prisma schema lives in `apps/api/prisma/schema.prisma`.
- The `content` folder is the versioned source of truth for educational content.

## Typical workflow

1. Update or add content in `content/`.
2. Reflect the content in Prisma seed data when needed.
3. Build the corresponding web page or API module.
4. Run `npm run lint`, `npm run typecheck`, and `npm run build` before merging.

## Notes

- Premium, Stripe, and social features are intentionally deferred.
- Keep the README and this document as the source of truth for local onboarding.
