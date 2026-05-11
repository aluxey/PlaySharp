# API Contract

Shared request and response types live in `packages/shared/src/api.ts`. The web app should treat
those types as the source of truth for route payloads.

## Contract rules

- All successful responses use a top-level `data` envelope.
- Content and quiz validation/not-found failures return a stable error object:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "code": "CONTENT_GAME_NOT_FOUND",
  "message": "Missing content for game: poker"
}
```

- The versioned content seed/review format is `content/{game}/content.json`.
- The `progress` and `profile` routes are driven by persisted quiz attempts and lesson
  completions.
- Authenticated user routes expect `Authorization: Bearer <token>`, using the token returned from `POST /auth/register` or `POST /auth/login`.

## Quick reference

| Route                                                  | Purpose                                | Response type                           |
| ------------------------------------------------------ | -------------------------------------- | --------------------------------------- |
| `POST /auth/register`                                  | Create account and return auth session | `AuthSessionResponse`                   |
| `POST /auth/login`                                     | Authenticate and return auth session   | `AuthSessionResponse`                   |
| `GET /auth/me`                                         | Fetch current auth user                | `AuthCurrentUserResponse`               |
| `GET /health`                                          | Service check                          | inline `{ status, service, timestamp }` |
| `GET /content/games`                                   | List game summaries                    | `ContentGamesResponse`                  |
| `GET /content/games/:game`                             | Fetch one game manifest                | `ContentGameResponse`                   |
| `GET /content/games/:game/themes`                      | List themes for a game                 | `ContentThemesResponse`                 |
| `GET /content/games/:game/themes/:themeSlug/lessons`   | List lessons for a theme               | `ContentThemeLessonsResponse`           |
| `GET /content/games/:game/themes/:themeSlug/questions` | List questions for a theme             | `ContentThemeQuestionsResponse`         |
| `GET /quiz/daily?game=poker`                           | Fetch the daily quiz                   | `QuizDailyResponse`                     |
| `POST /quiz/attempts`                                  | Persist submitted quiz answers         | `QuizAttemptSubmitResponse`             |
| `GET /stats/me`                                        | Fetch progress overview                | `ProgressOverviewResponse`              |
| `GET /users/me/profile`                                | Fetch profile overview                 | `ProfileOverviewResponse`               |
| `GET /users/me/lesson-completion`                      | Fetch one lesson completion status     | `LessonCompletionResponse`              |
| `POST /users/me/lesson-completions`                    | Mark one lesson complete               | `LessonCompletionResponse`              |
| `GET /admin/overview`                                  | Fetch content inventory totals         | `AdminOverviewResponse`                 |
| `GET /admin/themes`                                    | List admin theme records               | `AdminThemesResponse`                   |
| `GET /admin/lessons`                                   | List admin lesson records              | `AdminLessonsResponse`                  |
| `POST /admin/lessons`                                  | Create lesson                          | `AdminLessonMutationResponse`           |
| `PATCH /admin/lessons/:id`                             | Update lesson                          | `AdminLessonMutationResponse`           |
| `DELETE /admin/lessons/:id`                            | Archive lesson                         | `AdminLessonMutationResponse`           |
| `GET /admin/questions`                                 | List admin question records            | `AdminQuestionsResponse`                |
| `POST /admin/questions`                                | Create question                        | `AdminQuestionMutationResponse`         |
| `PATCH /admin/questions/:id`                           | Update question                        | `AdminQuestionMutationResponse`         |
| `DELETE /admin/questions/:id`                          | Archive question                       | `AdminQuestionMutationResponse`         |
| `GET /admin/export`                                    | Export content catalog                 | `AdminContentExportResponse`            |

## Implemented routes

### Auth

- `POST /auth/register`
  - request body: `{ name, email, password }`
  - response type: `AuthSessionResponse`
- `POST /auth/login`
  - request body: `{ email, password }`
  - response type: `AuthSessionResponse`
- `GET /auth/me`
  - response type: `AuthCurrentUserResponse`
  - auth required: yes

Example:

```json
{
  "data": {
    "session": {
      "accessToken": "jwt-like-token",
      "expiresAt": "2026-04-16T12:00:00.000Z",
      "user": {
        "id": "uuid",
        "email": "alex@example.com",
        "role": "user",
        "plan": "free"
      }
    }
  }
}
```

Auth error codes:

- `AUTH_EMAIL_TAKEN`
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_UNAUTHORIZED`
- `AUTH_USER_NOT_FOUND`

### Health

- `GET /health`

Response:

```json
{
  "status": "ok",
  "service": "api",
  "timestamp": "2026-04-09T12:00:00.000Z"
}
```

### Content

- `GET /content/games`
  - response type: `ContentGamesResponse`
- `GET /content/games/:game`
  - response type: `ContentGameResponse`
- `GET /content/games/:game/themes`
  - response type: `ContentThemesResponse`
- `GET /content/games/:game/themes/:themeSlug/lessons`
  - response type: `ContentThemeLessonsResponse`
- `GET /content/games/:game/themes/:themeSlug/questions`
  - response type: `ContentThemeQuestionsResponse`

Example:

```json
{
  "data": {
    "games": [
      {
        "game": "poker",
        "name": "Poker",
        "themeCount": 2,
        "lessonCount": 4,
        "questionCount": 4
      }
    ]
  }
}
```

Content error codes:

- `CONTENT_UNKNOWN_GAME`
- `CONTENT_GAME_NOT_FOUND`
- `CONTENT_THEME_NOT_FOUND`

### Quiz

- `GET /quiz/daily?game=poker`
  - response type: `QuizDailyResponse`
- `POST /quiz/attempts`
  - request body: `QuizAttemptSubmitRequest`
  - response type: `QuizAttemptSubmitResponse`
  - auth required: yes

Example:

```json
{
  "data": {
    "quiz": {
      "game": "poker",
      "themeSlug": "preflop-position",
      "themeName": "Preflop Position",
      "question": {
        "slug": "button-open-raise",
        "title": "Button open raise"
      }
    }
  }
}
```

Quiz error codes:

- `QUIZ_ATTEMPT_EMPTY`
- `QUIZ_CHOICE_NOT_FOUND`
- `QUIZ_GAME_NOT_FOUND`
- `QUIZ_INVALID_ATTEMPT`
- `QUIZ_UNKNOWN_GAME`
- `QUIZ_DAILY_NOT_FOUND`
- `QUIZ_QUESTION_NOT_FOUND`

### Progress

- `GET /stats/me`
  - response type: `ProgressOverviewResponse`
  - auth required: yes

Fields include:

- `summary`
- `weeklyAccuracy`
- `themesToImprove`
- `recurringMistakes`
- `recommendation`

### Profile

- `GET /users/me/profile`
  - response type: `ProfileOverviewResponse`
  - auth required: yes
- `GET /users/me/lesson-completion?game=poker&themeSlug=preflop-position&lessonSlug=button-play`
  - response type: `LessonCompletionResponse`
  - auth required: yes
- `POST /users/me/lesson-completions`
  - request body: `LessonCompletionRequest`
  - response type: `LessonCompletionResponse`
  - auth required: yes

Fields include:

- `user`
- `stats`
- `recentQuizScores`
- `achievements`

### Admin

- `GET /admin/overview`
  - response type: `AdminOverviewResponse`
  - auth required: yes
  - admin role required: yes
- `GET /admin/themes`
  - response type: `AdminThemesResponse`
  - auth required: yes
  - admin role required: yes
- `GET /admin/lessons`
  - response type: `AdminLessonsResponse`
  - auth required: yes
  - admin role required: yes
- `POST /admin/lessons`
  - request body: `AdminLessonMutationRequest`
  - response type: `AdminLessonMutationResponse`
  - auth required: yes
  - admin role required: yes
- `PATCH /admin/lessons/:id`
  - request body: `AdminLessonMutationRequest`
  - response type: `AdminLessonMutationResponse`
  - auth required: yes
  - admin role required: yes
- `DELETE /admin/lessons/:id`
  - response type: `AdminLessonMutationResponse`
  - auth required: yes
  - admin role required: yes
- `GET /admin/questions`
  - response type: `AdminQuestionsResponse`
  - auth required: yes
  - admin role required: yes
- `POST /admin/questions`
  - request body: `AdminQuestionMutationRequest`
  - response type: `AdminQuestionMutationResponse`
  - auth required: yes
  - admin role required: yes
- `PATCH /admin/questions/:id`
  - request body: `AdminQuestionMutationRequest`
  - response type: `AdminQuestionMutationResponse`
  - auth required: yes
  - admin role required: yes
- `DELETE /admin/questions/:id`
  - response type: `AdminQuestionMutationResponse`
  - auth required: yes
  - admin role required: yes
- `GET /admin/export`
  - response type: `AdminContentExportResponse`
  - auth required: yes
  - admin role required: yes

Admin mutations write to PostgreSQL. The versioned content manifests remain the durable review
format; use `GET /admin/export` when admin edits need to be brought back into content JSON.

## Planned but not implemented here

- billing and premium routes

## Stable error codes

- `ADMIN_INVALID_CONTENT`
- `ADMIN_RECORD_NOT_FOUND`
- `ADMIN_THEME_NOT_FOUND`
- `AUTH_EMAIL_TAKEN`
- `AUTH_FORBIDDEN`
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_UNAUTHORIZED`
- `AUTH_USER_NOT_FOUND`
- `CONTENT_UNKNOWN_GAME`
- `CONTENT_GAME_NOT_FOUND`
- `CONTENT_DRIFT_DETECTED`
- `CONTENT_SOURCE_UNAVAILABLE`
- `CONTENT_THEME_NOT_FOUND`
- `LESSON_COMPLETION_NOT_FOUND`
- `QUIZ_ATTEMPT_EMPTY`
- `QUIZ_CHOICE_NOT_FOUND`
- `QUIZ_GAME_NOT_FOUND`
- `QUIZ_INVALID_ATTEMPT`
- `QUIZ_UNKNOWN_GAME`
- `QUIZ_DAILY_NOT_FOUND`
- `QUIZ_QUESTION_NOT_FOUND`
- `UPSTREAM_UNAVAILABLE`
