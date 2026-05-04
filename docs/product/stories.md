# Product Stories

This backlog keeps the hardening and product follow-up work split into shippable stories.

## Story 1: Admin Content Editing

As an admin, I want to create and update lessons and questions from the admin workspace so content
does not require direct JSON edits.

Acceptance criteria:

- Admin routes remain protected by API role checks.
- Admin can create, edit, and archive lessons.
- Admin can create, edit, and archive quiz questions and choices.
- Content validation errors are shown before save.
- Changes are persisted in PostgreSQL and can be exported back to versioned content.

## Story 2: Stable Next Release Upgrade Path

As a maintainer, I want to leave Next canary once a stable release ships with a fixed PostCSS
dependency so production builds rely on stable framework packages.

Acceptance criteria:

- `npm audit --omit=dev` remains clean.
- `npm run build` passes without forcing Turbopack in restricted environments.
- `apps/web/package.json` uses a stable Next release.
- Any temporary build flags are documented or removed.

## Story 3: Real Lesson Completion Tracking

As a learner, I want completed lessons to be tracked explicitly so profile and progress metrics are
based on real reading activity, not inferred theme mastery.

Acceptance criteria:

- A lesson completion model exists in Prisma.
- Lesson detail pages can mark a lesson as complete.
- Profile and progress summaries use explicit completion records.
- Existing users with no records show zero completed lessons.

## Story 4: Adaptive Daily Quiz Selection

As a learner, I want the daily quiz to target weak themes and avoid repeating the same set every
time so practice feels relevant.

Acceptance criteria:

- Daily quiz selection uses recent attempts and weak-theme signals.
- A user does not receive the exact same daily set repeatedly when alternatives exist.
- Quiz size is configurable within API limits.
- Anonymous users still receive a deterministic starter set.

## Story 5: Database-Backed Content Source

As a maintainer, I want the API content reads and quiz submission validation to use the same source
of truth so JSON and database drift cannot break quiz submissions.

Acceptance criteria:

- Public content endpoints read from PostgreSQL or a synchronized content snapshot.
- Seed/sync records the content version used.
- CI verifies content manifests against runtime validation.
- Drift produces a clear operational error instead of partial quiz failures.

## Story 6: Integration Test Layer

As a developer, I want API integration tests against a test database so auth, quiz, progress, and
admin behavior are verified end to end.

Acceptance criteria:

- Test database setup is automated.
- Auth register/login/me flows are covered.
- Quiz submission updates attempts, daily usage, profile, and progress.
- Admin endpoints return 401/403/200 for unauthenticated/user/admin cases.

## Story 7: Production Environment Hardening

As an operator, I want startup and deployment checks to fail early when required production config
is unsafe or missing.

Acceptance criteria:

- Required environment variables are validated at startup.
- Production CORS refuses wildcard origins.
- JWT secret and database URL checks are documented.
- Health endpoint can expose readiness separately from liveness.
