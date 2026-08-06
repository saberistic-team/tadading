# Architecture

## Decision

TadaDing is a **modular monolith** with three deployables:

1. `apps/web` — Next.js public PWA, account, billing, and admin UI (no direct DB access)
2. `apps/api` — NestJS HTTP API
3. `apps/worker` — NestJS standalone process for health + BullMQ outbox dispatch

Shared logic lives in `packages/*`.

See ADR [0001-modular-monolith](adr/0001-modular-monolith.md).

## Current topology (through Phase 2)

- Config validation via `@tadading/config` (Zod)
- Branding via environment variables (ADR [0002](adr/0002-env-driven-branding.md))
- Pure puzzle engine (`@tadading/puzzle-engine`, ADR [0003](adr/0003-pure-puzzle-engine.md))
- PostgreSQL via `@tadading/db` (Drizzle): puzzles, attempts, guest streaks, outbox/inbox
- Event envelopes in `@tadading/events`; outbox → BullMQ (ADR [0004](adr/0004-transactional-outbox.md))
- Redis for BullMQ + readiness; Compose also runs Temporal/Mailpit/OTEL/Prometheus/Grafana

## Later phases (not implemented yet)

- Passkeys, sessions, email recovery
- Stripe Checkout + webhooks + entitlements
- Temporal daily puzzle workflows
- Full OpenTelemetry instrumentation

## Dependency direction

Applications may depend on packages. Packages must not depend on applications. Domain/contracts packages stay framework-free.
