# Changelog

## Unreleased

### 2026-04-09

- Added Prisma-backed auth register/login endpoints, signed bearer-token sessions, and auth protection for `/stats/me` and `/users/me/profile`.
- Added persisted quiz attempt submission with score calculation, stored answer records, and authenticated `POST /quiz/attempts`.
