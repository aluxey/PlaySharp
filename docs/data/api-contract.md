# API Contract

Shared request and response types live in `packages/shared/src/api.ts`. The web app should treat those types as the source of truth for route payloads.

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

- The versioned content source of truth is `content/{game}/content.json`.
- The `progress`, `profile`, and `admin` read routes are currently content-derived until user-attempt persistence is wired end to end.
- Authenticated user routes expect `Authorization: Bearer <token>`, using the token returned from `POST /auth/register` or `POST /auth/login`.

## Quick reference

See `docs/data/api-quick-reference.md` for the condensed endpoint table.

## Implemented routes

### Auth

- `POST /auth/register`
  - request body: `{ name, email, password }`
  - response type: `AuthSessionResponse`
- `POST /auth/login`
  - request body: `{ email, password }`
  - response type: `AuthSessionResponse`

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

Fields include:

- `user`
- `stats`
- `recentQuizScores`
- `achievements`

### Admin

- `GET /admin/overview`
  - response type: `AdminOverviewResponse`
- `GET /admin/themes`
  - response type: `AdminThemesResponse`
- `GET /admin/lessons`
  - response type: `AdminLessonsResponse`
- `GET /admin/questions`
  - response type: `AdminQuestionsResponse`

Admin responses are read-only inventory views over the versioned content manifests.

## Planned but not implemented here

- protected admin write routes
- billing and premium routes
