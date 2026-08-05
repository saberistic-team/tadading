# ADR 0004 — Transactional outbox + BullMQ dispatcher

## Status

Accepted (Phase 2)

## Context

Attempt lifecycle events must not be lost if the process crashes between DB commit and queue publish.

## Decision

Write domain events to `outbox_events` in the same Postgres transaction as attempt/streak mutations. A worker polls undispatched rows, enqueues BullMQ jobs keyed by event id, and marks inbox+dispatched idempotently.

## Consequences

- At-least-once delivery with inbox dedupe
- API request path stays free of Redis/Temporal coupling
- Trace IDs flow from API → outbox → worker logs
