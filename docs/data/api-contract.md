# API Contract

## Health

- `GET /health` - service check

## Auth

- `POST /auth/register` - create a user
- `POST /auth/login` - authenticate a user

## Content

- `GET /content/games` - list game summaries
- `GET /content/games/:game` - fetch one game manifest
- `GET /content/games/:game/themes` - list themes for a game
- `GET /content/games/:game/themes/:themeSlug/lessons` - list lessons for a theme
- `GET /content/games/:game/themes/:themeSlug/questions` - list questions for a theme

## Quiz

- `GET /quiz/daily?game=poker` - fetch the daily quiz
- `POST /quiz/start` - create a quiz attempt
- `POST /quiz/answer` - submit one answer
- `POST /quiz/end` - close the attempt

## Lessons

- `GET /lessons` - list lessons
- `GET /lessons/:id` - fetch one lesson

## Progress

- `GET /stats/me` - personal stats
- `GET /history` - quiz history

## Admin

- `GET /admin/themes`
- `POST /admin/themes`
- `GET /admin/lessons`
- `POST /admin/lessons`
- `GET /admin/questions`
- `POST /admin/questions`

## Future premium routes

- `POST /billing/checkout`
- `GET /billing/status`

## Notes

- Admin routes must be protected.
- Quiz routes should stay fast and stateless where possible.
- Responses should include enough context for immediate UI feedback.
