# Product Stories

This backlog tracks active, unfinished stories only. Completed stories were removed from the active
list after review: admin content editing, real lesson completion tracking, and database-backed
content source.

Priorities:

- P0: required before a reliable beta/staging release
- P1: strengthens the core learning loop
- P2: prepares post-beta growth without expanding the first release too early

## Story 1: Production Environment Hardening

Priority: P0.

As an operator, I want startup and deployment checks to fail early when required production config
is unsafe or missing.

Acceptance criteria:

- Required API and web environment variables are validated at startup.
- Production CORS refuses wildcard origins and missing `WEB_APP_URL`.
- `JWT_SECRET`, `DATABASE_URL`, and public API URL requirements are documented with examples.
- Health endpoints expose liveness and readiness separately.
- Readiness verifies database connectivity and content sync availability.

## Story 2: Integration Test Layer

Priority: P0.

As a developer, I want API integration tests against a test database so auth, quiz, progress, and
admin behavior are verified end to end.

Acceptance criteria:

- Test database setup and teardown are automated.
- Auth register, login, and current-user flows are covered.
- Quiz submission updates attempts, daily usage, profile, and progress.
- Lesson completion updates profile and progress summaries.
- Admin endpoints return 401, 403, and 200/201 responses for unauthenticated, learner, and admin
  cases.
- Tests run from `npm test` without requiring manual local state.

## Story 3: Staging Release Gate

Priority: P0.

As a maintainer, I want one repeatable staging validation command so beta releases are not judged by
manual clicking alone.

Acceptance criteria:

- A staging smoke command validates landing, auth, quiz, lesson, progress, profile, and admin guard
  flows.
- The command can target a local or remote base URL.
- Failures include the route, expected result, and received result.
- The staging checklist in `docs/deployment-staging.md` references the command.
- The release is blocked when the smoke command fails.

## Story 4: Adaptive Daily Quiz Selection

Priority: P1.

As a learner, I want the daily quiz to target weak themes and avoid repeating the same set every
time so practice feels relevant.

Acceptance criteria:

- Daily quiz selection uses recent attempts, recurring mistakes, and weak-theme signals.
- A user does not receive the exact same daily set repeatedly when alternatives exist.
- Quiz size is configurable within API limits.
- Anonymous users still receive a deterministic starter set.
- The selection result records enough metadata to explain why a question was chosen.

## Story 5: Mistake Review Loop

Priority: P1.

As a learner, I want missed questions to lead directly to the right lesson so I can correct the
mistake while it is fresh.

Acceptance criteria:

- Quiz results group wrong answers by game and theme.
- Each wrong answer links to the most relevant lesson detail page.
- The dashboard highlights the next lesson after a weak-theme quiz result.
- Repeated mistakes are visible from progress and profile surfaces.
- Empty states explain what will appear after the first quiz attempt.

## Story 6: Learning Habit System

Priority: P1.

As a learner, I want a clear daily habit signal so I know whether I am building consistency.

Acceptance criteria:

- Daily quiz completion updates a persisted streak or habit model.
- Dashboard and profile show current streak, best streak, and last active day.
- Missed days reset or pause streaks according to a documented rule.
- Streak logic is tested around timezone boundaries.
- Copy avoids punishing language when a learner has no streak.

## Story 7: Product Analytics Events

Priority: P1.

As a product owner, I want the core funnel and learning-quality events tracked so beta feedback can
be measured instead of guessed.

Acceptance criteria:

- Events exist for signup, quiz start, quiz completion, explanation view, lesson view, lesson
  completion, and admin export.
- Events follow the metric names in `docs/product/metrics.md`.
- Analytics capture game, theme, user plan, auth state, and anonymous/session identifiers where
  appropriate.
- The app can disable analytics in local development and tests.
- No sensitive answer text, email, password, or JWT data is sent to analytics.

## Story 8: Content Quality Dashboard

Priority: P1.

As a content maintainer, I want coverage and quality gaps surfaced in the admin workspace so the
catalog can grow deliberately.

Acceptance criteria:

- Admin overview shows lesson and question coverage by game, theme, and difficulty.
- Duplicate slugs, missing explanations, missing correct choices, and empty lesson bodies are
  flagged.
- Themes below a target coverage threshold are called out.
- Exported content preserves enough metadata for Git review.
- The content check command and admin dashboard use the same validation rules.

## Story 9: Editorial Draft And Review Workflow

Priority: P2.

As an admin, I want content changes to move through draft, preview, and publish states so edits do
not immediately affect learners.

Acceptance criteria:

- Lessons and questions can be saved as drafts.
- Draft content can be previewed from the admin workspace.
- Publishing creates a versioned content revision with author and timestamp metadata.
- Archived content remains hidden from learners but visible to admins.
- The export flow distinguishes published content from draft-only changes.

## Story 10: Personalized Onboarding

Priority: P2.

As a new learner, I want the product to understand my game and experience level so the first quiz
and lessons feel relevant.

Acceptance criteria:

- Registration or first-run onboarding captures preferred game and self-assessed level.
- Dashboard defaults to the selected game after onboarding.
- The first daily quiz uses onboarding preferences before attempt history exists.
- Learners can update preferences from the profile page.
- Onboarding can be skipped without blocking the core product loop.

## Story 11: Password Reset And Account Recovery

Priority: P2.

As a learner, I want to reset my password securely so losing access does not require manual support.

Acceptance criteria:

- Forgot-password requests create short-lived, single-use reset tokens.
- Reset links do not reveal whether an email exists.
- Password resets invalidate existing sessions when appropriate.
- The web forgot-password placeholder is replaced by a working flow.
- Token expiry, reuse, and invalid-token cases are tested.

## Story 12: Accessibility And Mobile Audit

Priority: P2.

As a learner on any device, I want the app to remain readable, navigable, and usable with keyboard
and assistive technologies.

Acceptance criteria:

- Landing, auth, dashboard, quiz, lessons, progress, profile, and admin pages pass keyboard
  navigation checks.
- Forms expose labels, errors, and focus states correctly.
- Quiz answer feedback does not rely on color alone.
- Mobile layouts avoid clipped text, hidden actions, and overlapping controls.
- A small accessibility checklist is added to the release process.

## Story 13: Observability And Support Diagnostics

Priority: P2.

As an operator, I want actionable logs and lightweight diagnostics so production issues can be
understood without exposing private user data.

Acceptance criteria:

- API logs include request id, route, status, duration, and authenticated role when available.
- Web API route handlers preserve request ids when proxying to the API.
- Error responses expose stable codes without leaking stack traces.
- Admin or support diagnostics can inspect content sync version and API readiness state.
- Logging behavior is documented for local, staging, and production environments.

## Story 14: Structured Lesson Content Model

Priority: P1.

As a learner, I want each lesson to contain clear sections, examples, and practice cues so study
feels substantial instead of reading a short placeholder paragraph.

Acceptance criteria:

- Lesson content supports structured sections such as summary, core idea, examples, mistakes to
  avoid, and practice prompts.
- The lesson detail page renders structured content without duplicating generic filler copy.
- Content JSON, validation, seed, and admin export flows preserve the richer lesson structure.
- Existing lessons are migrated from single-paragraph content into the new structure.
- Smoke or integration coverage verifies that a structured lesson renders and can still be marked
  complete.
