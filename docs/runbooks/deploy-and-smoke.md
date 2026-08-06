# Runbook — Deploy and smoke

1. Ensure CI is green on the PR.
2. Confirm Fly secrets for brand + `DATABASE_URL` / `REDIS_URL` on api and worker.
3. Let `deploy.yml` run `flyctl deploy` (or `pnpm fly:deploy` locally).
4. Wait for API `GET /health/ready` → `status: ready`.
5. Open web root (`https://tadading-web.fly.dev` by default); confirm brand strings match env.
6. Record deployed commit SHA (`fly releases -a tadading-api`).
