# Runbook — Rollback

1. In Render, select previous successful deploy for affected services.
2. If schema changed incompatibly, restore Postgres backup first (Phase 0 baseline is additive).
3. Verify API `/health/ready`.
4. Verify web loads.
5. Announce incident notes in the ops channel/doc.
