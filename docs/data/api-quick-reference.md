# API Quick Reference

## Success envelope

```json
{
  "data": {}
}
```

## Error envelope

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "code": "QUIZ_UNKNOWN_GAME",
  "message": "Unknown game: chess"
}
```

## Routes

| Route                                                  | Purpose                                | Response type                           |
| ------------------------------------------------------ | -------------------------------------- | --------------------------------------- |
| `GET /health`                                          | Service check                          | inline `{ status, service, timestamp }` |
| `GET /content/games`                                   | List game summaries                    | `ContentGamesResponse`                  |
| `GET /content/games/:game`                             | Fetch one game manifest                | `ContentGameResponse`                   |
| `GET /content/games/:game/themes`                      | List themes for a game                 | `ContentThemesResponse`                 |
| `GET /content/games/:game/themes/:themeSlug/lessons`   | List lessons for a theme               | `ContentThemeLessonsResponse`           |
| `GET /content/games/:game/themes/:themeSlug/questions` | List questions for a theme             | `ContentThemeQuestionsResponse`         |
| `GET /quiz/daily?game=poker`                           | Fetch the daily quiz                   | `QuizDailyResponse`                     |
| `GET /stats/me`                                        | Fetch progress overview                | `ProgressOverviewResponse`              |
| `GET /users/me/profile`                                | Fetch profile overview                 | `ProfileOverviewResponse`               |
| `GET /admin/overview`                                  | Fetch source-of-truth inventory totals | `AdminOverviewResponse`                 |
| `GET /admin/themes`                                    | List admin theme records               | `AdminThemesResponse`                   |
| `GET /admin/lessons`                                   | List admin lesson records              | `AdminLessonsResponse`                  |
| `GET /admin/questions`                                 | List admin question records            | `AdminQuestionsResponse`                |

## Stable content and quiz error codes

- `CONTENT_UNKNOWN_GAME`
- `CONTENT_GAME_NOT_FOUND`
- `CONTENT_THEME_NOT_FOUND`
- `QUIZ_UNKNOWN_GAME`
- `QUIZ_DAILY_NOT_FOUND`

## Source of truth

- Content manifests: `content/poker/content.json`, `content/blackjack/content.json`
- Shared contract types: `packages/shared/src/api.ts`
