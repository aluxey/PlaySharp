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

## Quick reference

See `docs/data/api-quick-reference.md` for the condensed endpoint table.

## Implemented routes

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

- `QUIZ_UNKNOWN_GAME`
- `QUIZ_DAILY_NOT_FOUND`

### Progress

- `GET /stats/me`
  - response type: `ProgressOverviewResponse`

Fields include:

- `summary`
- `weeklyAccuracy`
- `themesToImprove`
- `recurringMistakes`
- `recommendation`

### Profile

- `GET /users/me/profile`
  - response type: `ProfileOverviewResponse`

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

- auth write flows beyond the existing module scaffolding
- quiz attempt creation and answer submission
- protected admin write routes
- billing and premium routes
