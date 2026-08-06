# Runbook — Rollback

1. On Fly, redeploy the previous successful release for affected apps (`fly releases -a tadading-api`, then `fly deploy --image <previous>` or redeploy a known-good git SHA).
2. If schema changed incompatibly, restore Postgres backup first (Phase 0 baseline is additive).
3. Verify API `/health/ready`.
4. Verify web loads.
5. Announce incident notes in the ops channel/doc.
