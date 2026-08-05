# Operations

## Local

```bash
pnpm compose:up
pnpm db:migrate
pnpm dev
pnpm smoke
```

## Infrastructure profiles

### Local / portable

Docker Compose provides Postgres, Redis, Temporal, Mailpit, OTEL, Prometheus, Grafana.

### Recommended production (Phase 0 Blueprint)

`render.yaml` uses Render-managed PostgreSQL + Redis (Key Value), plus Docker services for web/api/worker.

### Strict self-hosted profile

Possible later by deploying containerized Postgres/Redis/Temporal/observability as private services. Application code is profile-agnostic via `DATABASE_URL` / `REDIS_URL`. Strict single-node is **not** high availability.

## Render deploy from PRs

1. Connect the GitHub repo to Render and apply `render.yaml`.
2. Create GitHub Environment `render-preview`.
3. Add secrets:
   - `RENDER_DEPLOY_HOOK_API` (required)
   - `RENDER_API_HEALTH_URL` (required)
   - `RENDER_DEPLOY_HOOK_WEB` / `RENDER_DEPLOY_HOOK_WORKER` (optional)
4. Set brand env vars on services.
5. Open a PR — `deploy.yml` triggers hooks and waits for `/health/ready`.

## Backup / restore (initial)

- Prefer Render-managed Postgres backups for the recommended profile.
- Document restore drills before charging customers (Phase 6 hardening).
- Redis is ephemeral cache/queue backing in Phase 0 — treat as disposable.

## Rollback

1. Redeploy the previous successful Render deploy for `tadading-api` / `tadading-web` / `tadading-worker`.
2. If a migration is incompatible, restore DB from backup before rollback (Phase 0 migration is additive baseline only).
3. Confirm `/health/ready` on the API.
