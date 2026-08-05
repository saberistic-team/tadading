# Runbook — Deploy and smoke

1. Ensure CI is green on the PR.
2. Confirm Render env vars for brand + `DATABASE_URL` / Redis linkage.
3. Let `deploy.yml` fire deploy hooks (or manually trigger hooks).
4. Wait for API `GET /health/ready` → `status: ready`.
5. Open web root; confirm brand strings match env.
6. Record deployed commit SHA.
