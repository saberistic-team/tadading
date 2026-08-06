# Agent guide — TadaDing

## Mission

Build a small, complete, maintainable production subscription product. Prefer working code over stubs. Work **one phase at a time**.

## Current phase

**Phase 2 — Attempts, streaks, and events.** Do not implement passkeys, Stripe, or Temporal puzzle workflows until explicitly told to continue to Phase 3.

## Architecture rules

- Modular monolith: `apps/web`, `apps/api`, `apps/worker`
- Shared packages under `packages/*`
- No business logic in React components or Nest controllers
- No database access from `apps/web`
- Brand via env (`BRAND_NAME`, `PUBLIC_DOMAIN`, `SOCIAL_HANDLE`) — never hardcode production domains
- TypeScript strict; no `any`; no unexplained `@ts-ignore`
- Prefer files under ~250 lines

## Package direction

`apps/*` → `packages/*` → (no reverse imports into apps)

`packages/domain` and `packages/contracts` must not import Nest, Next, Drizzle, or Stripe.

## Commands

See README. Default verification: `pnpm verify` (requires local services for smoke).

## After each phase

Stop and report: summary, files, ADRs, migrations, commands, tests, security, risks, PR title/body, Fly.io checklist, smoke checklist, rollback.
