# Roadmap

## Status

- Phase 0 is documented
- Phase 1 scaffolding is underway
- The next step is to connect the route shells to real data and content

## Current focus

- Lock the V1 scope and success metrics
- Scaffold the learning surfaces in the web app
- Set the backend module boundaries early
- Keep premium and social features out of the first delivery slice

## Delivery phases

### 0. Product framing

Goal: define exactly what V1 is, who it serves, and how success is measured.

Deliverables:

- `docs/product/v1-scope.md`
- `docs/product/metrics.md`
- release criteria for the first beta

Exit criteria:

- core journeys are documented
- in-scope and out-of-scope items are explicit
- there is a written definition of success for the first release

### 1. UX and UI system

Goal: create the visual and interaction foundation before feature work expands.

Deliverables:

- visual tokens and page templates
- reusable card, button, and layout patterns
- empty, loading, and error states
- route scaffolding for the main screens

Exit criteria:

- the landing page and app shell feel consistent
- mobile and desktop layouts are both covered
- the main navigation paths are represented in the app router

### 2. Content and data model

Goal: define the teaching structure and persistence model once, then reuse it everywhere.

Deliverables:

- game, theme, lesson, and question taxonomy
- content folder structure
- database schema and Prisma model
- seed strategy for versioned content

Exit criteria:

- content has one clear source of truth
- the schema supports both learning content and progress tracking
- identifiers and naming conventions are consistent

### 3. API foundation

Goal: expose clean backend boundaries for auth, quiz, lessons, progress, and admin.

Deliverables:

- NestJS module structure
- health endpoint
- route contracts for the main product areas
- validation and error-handling conventions

Exit criteria:

- each domain has a clear module boundary
- the API can evolve without coupling product areas together
- the web app can rely on a stable contract shape

### 4. Frontend foundation

Goal: implement the user-facing experience for the main learning loop.

Deliverables:

- landing page
- dashboard
- quiz flow
- lesson browser
- progress views
- profile and admin entry points

Exit criteria:

- a user can navigate the main learning loop end to end
- the UI is responsive and readable
- the quiz flow is fast and obvious

### 5. Quality and operations

Goal: protect the product before it grows.

Deliverables:

- lint and formatting rules
- type checking
- CI workflow
- environment file template
- basic build verification

Exit criteria:

- the repo builds from a clean checkout
- regressions are caught automatically
- the development setup is reproducible

## Deferred phases

### Premium and payments

Hold until the core product is stable. Add Stripe, entitlement checks, and premium UX only once the base loop is reliable.

### Admin workspace expansion

Grow the content management workflow after the first content pipeline is in place.

### Deployment and operations hardening

Add monitoring, backups, analytics, and legal pages after the product shape settles.
