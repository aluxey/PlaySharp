# PlaySharp

PlaySharp is a monorepo for a training product focused on poker and blackjack.
The goal is to turn study into a daily habit with short interactive drills, instant feedback,
clear explanations, and visible progress tracking.

## Stack

- Web: Next.js + TypeScript
- API: NestJS + PostgreSQL + Prisma
- Package manager: npm workspaces

## Getting started

1. Read the technical setup guide: `docs/technical-setup.md`
2. Install dependencies with `npm install`
3. Copy `.env.example` to the app-specific env files described in the guide
4. Create the database and run the Prisma migration and seed
5. Start the apps with `npm run dev`

## Main commands

- `npm run dev` - start the API and web app together
- `npm run dev:api` - start the API only
- `npm run dev:web` - start the web app only
- `npm run build` - build both workspaces
- `npm run lint` - run ESLint across the repo
- `npm run typecheck` - run TypeScript checks across the workspaces
- `npm run format` - format the repository

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
