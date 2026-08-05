# ADR 0001 — Modular monolith with three deployables

## Status

Accepted (Phase 0)

## Context

TadaDing needs clear separation of web, API, and async work without the operational cost of many microservices for a one-person business.

## Decision

Use a modular monolith:

- `apps/web`, `apps/api`, `apps/worker` as deployables
- Domain modules inside the API with packages for shared pure logic
- PostgreSQL transactional outbox later for reliable async handoff

## Consequences

- Simple request path for gameplay
- Independent scale of web/API/worker processes
- One repo, one mental model, transferable ownership
- Must enforce package boundaries in lint/review to avoid a distributed ball of mud
