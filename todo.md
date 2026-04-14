# PlaySharp TODOs and Next Steps

## Project tour (quick)

- `apps/web`: Next.js app for the user experience (dashboard, quiz, lessons, progress, profile, admin entry points).
- `apps/api`: NestJS API with Prisma + PostgreSQL (content, quiz, progress, users, admin).
- `packages/shared`: shared types and constants (API contracts, content types).
- `packages/ui`: reusable UI helpers and components.
- `packages/config`: shared config presets.
- `content`: versioned poker/blackjack lesson and question source of truth.
- `docs`: product, UX, data, and technical documentation.

## Docs tour (what to read)

- `docs/product/vision.md`: product vision and core learning loop.
- `docs/product/v1-scope.md`: V1 in-scope vs out-of-scope, release criteria.
- `docs/product/roadmap.md`: phased delivery plan and current focus.
- `docs/product/metrics.md`: success metrics to track post-beta.
- `docs/ux/screens.md`: target UI/UX content per screen.
- `docs/ux/frontend-guidelines.md`: visual and interaction guidelines.
- `docs/data/api-contract.md`: API envelope rules and route definitions.
- `docs/data/api-quick-reference.md`: condensed API route table.
- `docs/data/database.md`: Prisma schema notes and data model overview.
- `docs/technical-setup.md`: technical setup and workflows.
- `docs/setup-api-and-db.md`: local API + DB setup and seed steps.

## Current status (from roadmap + README)

- V1 scope, metrics, and roadmap are documented.
- UX/UI foundation and frontend screens are in place.
- Content schema and Prisma seed pipeline are established.
- API contracts and persisted V1 flows exist for auth, quiz, progress, profile, and admin inventory.
- Next major effort: keep hardening the protected V1 slice for staging feedback and future admin workflow expansion.

## Next steps (suggested TODOs)

### Product and UX

- [x] Validate the V1 user journey end-to-end (quiz -> feedback -> lesson -> progress).
- [x] Confirm which admin features are needed in V1 (read-only vs CRUD) and document it.
- [x] Align each screen with `docs/ux/screens.md` content requirements.

### Content and data

- [x] Add content validation (schema or lint) to prevent malformed JSON.
- [x] Expand content coverage per difficulty distribution and avoid duplicates.
- [x] Ensure content updates always run `npm run seed --workspace @playsharp/api`.

### API

- [x] Implement auth flows (register/login) and protect user-specific endpoints.
- [x] Add quiz attempt persistence (create attempt, store answers, compute score).
- [x] Power progress endpoints from attempts instead of content-only placeholders.
- [x] Protect admin inventory endpoints and page behind admin-only access.
- [x] Add a documented admin promotion command for local and staging access.
- [x] Defer admin write endpoints until post-V1 CRUD work.

### Web

- [x] Wire login/register pages to real auth endpoints.
- [x] Submit quiz answers to the API and display result state from response.
- [x] Use lesson/theme routes for deep links and catalog navigation.
- [x] Replace placeholder stats with API-backed progress data.

### Quality and operations

- [x] Ensure CI runs lint, typecheck, and format checks.
- [x] Add smoke tests for API health and web routes.
- [x] Validate admin access control in the smoke flow for guest, user, and admin roles.
- [x] Document a minimal deployment/staging setup once V1 is stable.

## Out of scope for V1 (do not start yet)

- Premium subscription and Stripe billing.
- Social leagues, rankings, and advanced analytics.
- Mobile app.
