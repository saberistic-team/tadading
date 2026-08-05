# TadaDing

Your daily tiny win — a language-light daily visual puzzle (subscription web app).

This repository is a pnpm + Turborepo modular monolith with three deployables:

- `apps/web` — Next.js App Router
- `apps/api` — NestJS HTTP API
- `apps/worker` — NestJS worker (health-only in Phase 0)

Brand values are **environment-driven** (`BRAND_NAME`, `PUBLIC_DOMAIN`, `SOCIAL_HANDLE`). Domain purchase can happen later without code changes.

## Prerequisites

- Node.js 22+
- pnpm 11.20.0 (`corepack enable`)
- Docker + Docker Compose

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm compose:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Services locally:

| Service | URL |
|---------|-----|
| Web | http://localhost:3100 |
| API live | http://localhost:3101/health/live |
| API ready | http://localhost:3101/health/ready |
| Worker live | http://localhost:3102/health/live |
| Mailpit UI | http://localhost:8025 |
| Temporal UI | http://localhost:8088 |
| Grafana | http://localhost:3103 (admin/admin) |
| Prometheus | http://localhost:9091 |
| Postgres (host) | `localhost:5433` |
| Redis (host) | `localhost:6380` |

Host ports are offset from the usual defaults to reduce collisions with other local stacks.

## Verify

With Compose and apps running:

```bash
pnpm verify
```

For CI-like checks without a running web/worker:

```bash
pnpm lint && pnpm typecheck && pnpm test:unit && pnpm build
SMOKE_SKIP_WEB=1 SMOKE_SKIP_WORKER=1 API_ORIGIN=http://localhost:3001 pnpm smoke
```

## Useful scripts

| Script | Purpose |
|--------|---------|
| `pnpm compose:up` / `compose:down` | Local infra |
| `pnpm db:migrate` / `db:seed` | Database |
| `pnpm dev` / `build` / `lint` / `typecheck` | Day-to-day |
| `pnpm test:unit` | Unit tests |
| `pnpm smoke` | Health smoke checks |
| `pnpm verify` | lint + typecheck + unit + build + smoke |

## Deploy (Render)

Blueprint: [`render.yaml`](render.yaml) (managed Postgres + Redis profile).

GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) deploys on pull requests when these **GitHub Environment `render-preview` secrets** are set:

| Secret | Purpose |
|--------|---------|
| `RENDER_DEPLOY_HOOK_API` | Deploy hook URL for `tadading-api` (required) |
| `RENDER_DEPLOY_HOOK_WEB` | Deploy hook for `tadading-web` (optional) |
| `RENDER_DEPLOY_HOOK_WORKER` | Deploy hook for `tadading-worker` (optional) |
| `RENDER_API_HEALTH_URL` | e.g. `https://tadading-api.onrender.com/health/ready` |
| `RENDER_API_KEY` | Optional alternative to deploy hooks |

Until secrets exist in the `render-preview` environment, the deploy job skips with a warning (does not fail CI). Once set, it deploys and waits for `/health/ready`.

Also set brand/origin env vars on Render services (`BRAND_NAME`, `PUBLIC_DOMAIN`, etc.).

Blueprint services use free instance plans. Free tier does not support `preDeployCommand`; the API runs database migrations on boot.

## Documentation

- [docs/architecture.md](docs/architecture.md)
- [docs/product.md](docs/product.md)
- [docs/operations.md](docs/operations.md)
- [docs/security.md](docs/security.md)
- [docs/privacy-data-map.md](docs/privacy-data-map.md)
- [AGENTS.md](AGENTS.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- Product plan source: [business.md](business.md)

## Phase status

**Phase 0 — Foundation** (current): monorepo, config, health, Compose, CI, Render blueprint.

Puzzle gameplay begins in Phase 1.
