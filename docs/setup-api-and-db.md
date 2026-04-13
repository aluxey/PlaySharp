## API & DB Setup (local)

Prereqs: Node 18+, npm, PostgreSQL.

1. Install dependencies

```bash
npm install
```

2. Configure the API environment

Create `apps/api/.env` with at least:

```
DATABASE_URL=postgresql://user:password@localhost:5432/playsharp
PORT=3001
```

3. Prepare the database

```bash
cd apps/api
npm run prisma:generate
npm run prisma:push
npm run seed
```

The repository does not ship committed Prisma migrations, so local schema updates should go through `prisma db push`.
The seed reads JSON content from `content/` and syncs games, themes, lessons, questions, and answer choices into PostgreSQL.

4. Start the API

```bash
npm run dev --workspace @playsharp/api
```

By default the API listens on `http://localhost:3001/api`.

5. Configure the web app

In `apps/web/.env.local`:

```
API_BASE_URL=http://localhost:3001/api
```

Then start the web app:

```bash
npm run dev --workspace @playsharp/web
```

The lessons, quiz, progress, profile, and admin pages call the API directly, so keep the API running and the database seeded.

Notes

- The source of truth for educational content is `content/{poker,blackjack}/content.json`.
- The same manifests are read by the API and by the Prisma seed.
- After changing content JSON, rerun `npm run seed --workspace @playsharp/api`.
- Contract details and route shapes are documented in `docs/data/api-contract.md`.
