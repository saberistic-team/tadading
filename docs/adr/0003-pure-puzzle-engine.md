# ADR 0003 — Pure TypeScript puzzle engine package

## Status

Accepted (Phase 1)

## Context

Puzzle generation, solving, and validation must be deterministic, testable without frameworks, and never leak solutions to clients.

## Decision

Implement `@tadading/puzzle-engine` as a side-effect-free package with a seeded PRNG, compatibility rules, dihedral canonicalization, bounded solver, generator, and public serialization helpers. The API persists public tile data plus a server-only solution hash.

## Consequences

- 1,000+ seed property coverage is practical in unit tests
- Clients can detect local completion via edge rules; server confirms via hash
- Future Temporal inventory jobs can call the same generator
