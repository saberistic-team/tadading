# ADR 0002 — Environment-driven branding

## Status

Accepted (Phase 0)

## Context

The preferred domain (`tadading.com`) may be purchased after foundation work begins. Social handles may differ from the brand string.

## Decision

All brand identity used by apps comes from validated environment variables:

- `BRAND_NAME`
- `PUBLIC_DOMAIN`
- `SOCIAL_HANDLE`
- `TAGLINE`

Defaults support local development (`localhost`, `playtadading`).

## Consequences

- Domain cutover does not require code changes
- Misconfiguration fails fast at process start
- Marketing assets must still be updated operationally when the brand finalizes
