# Architecture

## Decision

TadaDing is a **modular monolith** with three deployables:

1. `apps/web` — Next.js public PWA, account, billing, and admin UI (no direct DB access)
2. `apps/api` — NestJS HTTP API
3. `apps/worker` — NestJS standalone process for queues/workflows (health-only in Phase 0)

Shared logic lives in `packages/*`.

See ADR [0001-modular-monolith](adr/0001-modular-monolith.md).

## Phase 0 topology

- Config validation via `@tadading/config` (Zod)
- Branding via environment variables (ADR [0002](adr/0002-env-driven-branding.md))
- PostgreSQL connectivity via `@tadading/db` (Drizzle)
- Redis ping for readiness
- Local Compose: Postgres, Redis, Temporal, Mailpit, OTEL Collector, Prometheus, Grafana

## Later phases (not implemented yet)

- Pure puzzle engine package
- Passkeys, sessions, email recovery
- Stripe Checkout + webhooks + entitlements
- Transactional outbox + BullMQ
- Temporal daily puzzle workflows
- Full OpenTelemetry instrumentation

## Dependency direction

Applications may depend on packages. Packages must not depend on applications. Domain/contracts packages stay framework-free.
