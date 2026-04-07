# PlaySharp

PlaySharp is a monorepo for a training product focused on poker and blackjack.
The goal is to turn study into a daily habit with short interactive drills, instant feedback,
clear explanations, and visible progress tracking.

## Stack

- Web: Next.js + TypeScript
- API: NestJS + PostgreSQL + Prisma
- Package manager: npm workspaces

## Repository layout

- `apps/web`: customer-facing web app
- `apps/api`: backend API
- `packages/shared`: shared types and constants
- `packages/ui`: reusable UI helpers and components
- `packages/config`: shared configuration presets
- `content`: versioned educational content
- `docs`: product, UX, and data documentation

## Documentation

- `docs/product/vision.md`
- `docs/product/roadmap.md`
- `docs/ux/frontend-guidelines.md`
- `docs/ux/screens.md`
- `docs/data/database.md`
- `docs/data/api-contract.md`

## Current status

The repository is now scaffolded. Next steps are wiring dependencies, generating the initial
app shells, and syncing the database seed with the versioned content.
