# Product

## Vision

PlaySharp helps poker and blackjack players build a daily learning habit through short drills,
immediate feedback, focused explanations, and visible progress tracking.

## Audience

- Beginners who need structure.
- Intermediate players who want to reduce recurring mistakes.
- Competitive players who want repeatable practice and measurable progress.

## Core loop

1. Choose a game or start the daily quiz.
2. Answer a short scenario-based question set.
3. Review immediate feedback and explanations.
4. Follow weak-theme recommendations into lessons.
5. Track progress and repeat the loop.

## V1 scope

In scope:

- Landing page.
- Authenticated dashboard.
- Daily quiz flow for poker and blackjack.
- Lesson browsing and lesson completion.
- Progress and profile views backed by quiz and lesson activity.
- Admin content workspace for inventory review, editing, archiving, and export.
- Versioned content seed manifests under `content/`.

Out of scope:

- Premium subscription and Stripe billing.
- Social leagues and rankings.
- Advanced analytics dashboards.
- Mobile app.

## Release criteria

- A learner can register or log in.
- A learner can complete a quiz, see answer feedback, and reach related lessons.
- Lesson completion and quiz attempts update progress/profile surfaces.
- An admin can review, edit, archive, and export content through protected admin routes.
- Content seed manifests can be reseeded into PostgreSQL.
- Lint, typecheck, build, tests, and smoke checks pass for the release candidate.

## Metrics

Activation:

- `sign_up_rate`: visitors who create an account.
- `quiz_start_rate`: signed-in users who begin a quiz.
- `first_quiz_completion_rate`: users who complete their first quiz.

Engagement:

- `daily_active_users`: users active on a given day.
- `quiz_completion_rate`: completed quizzes divided by started quizzes.
- `lesson_view_rate`: lesson visits divided by quiz completions.

Retention:

- `d1_retention`: returning active users after one day.
- `d7_retention`: returning active users after seven days.
- `streak_growth`: change in streak length over time.

Learning quality:

- `accuracy_rate`: correct answers divided by total answers.
- `weak_theme_recovery`: improvement in weak themes over time.
- `explanation_view_rate`: answer views that reach the explanation step.

Operational health:

- `api_error_rate`.
- `quiz_latency`.
- `build_success_rate`.

Set numeric targets after the first beta cohort. Until then, use these metrics to compare trends
between releases.
