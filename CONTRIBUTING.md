# Contributing

## Setup

1. Install Node 22+ and enable pnpm via Corepack.
2. `cp .env.example .env`
3. `pnpm install`
4. `pnpm compose:up`
5. `pnpm db:migrate && pnpm db:seed`
6. `pnpm dev`

## Pull requests

- One logical change per PR when practical.
- CI must pass (`ci`, `integration`).
- Deploy workflow runs on PRs once Fly secrets are configured in the `fly-preview` GitHub Environment.
- Do not commit `.env`, secrets, or webhook payloads.

## Code style

- TypeScript strict settings from `tsconfig.base.json`
- ESLint flat config at repo root
- Vitest for unit tests
- Zod for env and public contracts

## Phases

Follow the phase plan in `business.md`. Do not skip ahead to puzzle/auth/billing work during Phase 0.
