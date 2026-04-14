# Minimal Deployment and Staging Setup

## Goal

Ship the smallest staging environment that can exercise the V1 product loop without adding extra
infrastructure complexity.

## Services

- PostgreSQL 16 database
- One API service running `@playsharp/api`
- One web service running `@playsharp/web`

This setup is intentionally simple. It is for product validation, smoke coverage, and internal
review, not high-availability production traffic.

## Required environment variables

### API service

- `DATABASE_URL`: PostgreSQL connection string
- `WEB_APP_URL`: public URL of the staging web app, used by API CORS
- `API_PORT`: API listen port, usually `3001`
- `JWT_SECRET`: staging-only signing secret
- `NODE_ENV=production`

### Web service

- `API_BASE_URL`: public API base URL, for example `https://staging-api.example.com/api`
- `NODE_ENV=production`

## Deployment order

1. Provision PostgreSQL and create an empty `playsharp` database.
2. Deploy the API with the staging environment variables.
3. Run the database/content sync commands against staging:

```bash
npm run prisma:generate --workspace @playsharp/api
npm run prisma:push --workspace @playsharp/api
npm run seed --workspace @playsharp/api
```

4. Build the monorepo:

```bash
npm ci
npm run build
```

5. Start the API service:

```bash
npm run start --workspace @playsharp/api
```

6. Start the web service:

```bash
npm run start --workspace @playsharp/web -- --hostname 0.0.0.0 --port 3000
```

7. Promote at least one existing user to admin if the staging team needs the admin workspace:

```bash
npm run admin:promote --workspace @playsharp/api -- --email you@example.com
```

## Staging validation checklist

- `GET /api/health` returns `status: ok`
- Landing page loads
- Register -> quiz attempt -> lesson route -> progress page works end to end
- Admin account can open `/admin` and non-admin accounts cannot
- Content catalog loads on lessons and quiz pages
- `npm run seed --workspace @playsharp/api` is rerun after content changes

## Recommended hosting shape

- Put the web app and API on separate staging hostnames
- Use a managed PostgreSQL instance instead of a container on the same VM when possible
- Keep staging data disposable; reseeding should be safe and repeatable

## Not covered by this minimal setup

- autoscaling or zero-downtime deploys
- backups and disaster recovery
- metrics, tracing, or log aggregation
- CDN, edge caching, or queue workers
- secret rotation and compliance hardening

Add those only after the V1 loop is stable enough to justify the operational overhead.
