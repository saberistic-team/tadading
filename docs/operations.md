# Operations

## Local

Infra + host apps:

```bash
pnpm compose:up
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm smoke
```

Full Docker stack (infra + api + worker + web):

```bash
pnpm stack:up
pnpm stack:smoke
pnpm stack:logs   # optional: follow api/web/worker
```

App containers use the Compose `apps` profile and in-network `postgres` / `redis` URLs. Host ports stay `3100` / `3101` / `3102`.

## Infrastructure profiles

### Local / portable

Docker Compose provides Postgres, Redis, Temporal, Mailpit, OTEL, Prometheus, Grafana. Optional `apps` profile adds api, worker, and web containers.

### Recommended production (Fly.io)

Three Fly apps (`tadading-api`, `tadading-web`, `tadading-worker`) plus Fly Postgres and Upstash Redis (via `fly redis`). Config: `apps/*/fly.toml`.

Migrations: the API applies Drizzle migrations on process start (`runMigrations`). Idempotent if run more than once.

### Strict self-hosted profile

Possible later by deploying containerized Postgres/Redis/Temporal/observability as private services. Application code is profile-agnostic via `DATABASE_URL` / `REDIS_URL`. Strict single-node is **not** high availability.

## Fly.io bootstrap

1. Install [flyctl](https://fly.io/docs/flyctl/install/) and `fly auth login`.
2. `pnpm fly:bootstrap` — creates `tadading-api` / `web` / `worker`, provisions Postgres, attaches `DATABASE_URL` to api + worker.
3. Create Redis (`fly redis create`) and set `REDIS_URL` secrets on api + worker.
4. Set `PUZZLE_SEED_SECRET` and `GUEST_HMAC_SECRET` on api + worker.
5. `pnpm fly:deploy` (api → worker → web) and confirm `/health/ready`.

Override brand/origin with `fly secrets set` or by editing `[env]` / `[build.args]` in the relevant `fly.toml` (web bakes `NEXT_PUBLIC_API_ORIGIN` at build time).

## Fly deploy from PRs

1. Create GitHub Environment `fly-preview`.
2. Add secrets:
   - `FLY_API_TOKEN` (required) — `fly tokens create deploy`
   - `FLY_API_HEALTH_URL` (optional) — default `https://tadading-api.fly.dev/health/ready`
3. Open a PR — `deploy.yml` runs `flyctl deploy` for all three apps and waits for `/health/ready`.

## Backup / restore (initial)

- Prefer Fly Postgres managed backups for the recommended profile.
- Document restore drills before charging customers (Phase 6 hardening).
- Redis is ephemeral cache/queue backing — treat as disposable.

## Rollback

1. Redeploy the previous image/release for `tadading-api` / `tadading-web` / `tadading-worker` (`fly releases` / `fly deploy --image …`, or revert the git SHA and redeploy).
2. If a migration is incompatible, restore DB from backup before rollback (Phase 0 migration is additive baseline only).
3. Confirm `/health/ready` on the API.
