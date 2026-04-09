# Changelog

## Unreleased

### 2026-04-09

- Added Prisma-backed auth register/login endpoints, signed bearer-token sessions, and auth protection for `/stats/me` and `/users/me/profile`.
- Added persisted quiz attempt submission with score calculation, stored answer records, and authenticated `POST /quiz/attempts`.
- Replaced placeholder progress summaries with aggregates from persisted attempts and daily usage on `GET /stats/me`.
- Wired the web login/register pages to live auth endpoints through Next route handlers, added cookie-backed sessions, and enabled logout.
