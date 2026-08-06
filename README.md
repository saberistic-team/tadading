# TadaDing

Your daily tiny win — a language-light daily visual puzzle (subscription web app).

This repository is a pnpm + Turborepo modular monolith with three deployables:

- `apps/web` — Next.js App Router
- `apps/api` — NestJS HTTP API
- `apps/worker` — NestJS worker (health + BullMQ outbox dispatcher)

Brand values are **environment-driven** (`BRAND_NAME`, `PUBLIC_DOMAIN`, `SOCIAL_HANDLE`). Domain purchase can happen later without code changes.

## Prerequisites

- Node.js 22+
- pnpm 11.20.0 (`corepack enable`)
- Docker + Docker Compose

## Quick start

Host apps against Compose infra:

```bash
cp .env.example .env
pnpm install
pnpm compose:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Full stack in Docker (infra + api + worker + web):

```bash
cp .env.example .env
pnpm stack:up
pnpm stack:smoke
```

`pnpm compose:up` starts infra only (safe alongside `pnpm dev`).  
`pnpm compose:stack` / `pnpm stack:up` also builds and runs the app containers (`apps` profile).

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
| `pnpm compose:up` / `compose:down` | Infra only (Postgres, Redis, Temporal, Mailpit, OTEL, Prometheus, Grafana) |
| `pnpm compose:ps` / `compose:logs` | Compose status / follow all logs |
| `pnpm compose:build` | Build api/web/worker images |
| `pnpm compose:stack` | Infra + api + worker + web (`--profile apps`) |
| `pnpm compose:stack:logs` / `compose:stack:restart` | App container logs / rebuild+recreate apps |
| `pnpm stack:up` / `stack:down` / `stack:smoke` | Full stack up (seed) / tear down / smoke |
| `pnpm fly:bootstrap` / `fly:deploy` | One-time Fly apps+DB scaffold / deploy all three apps |
| `pnpm fly:deploy:api` / `web` / `worker` | Deploy a single Fly app |
| `pnpm db:migrate` / `db:seed` | Database (host → published Postgres `5433`) |
| `pnpm dev` / `build` / `lint` / `typecheck` | Day-to-day |
| `pnpm test:unit` | Unit tests |
| `pnpm smoke` | Health smoke checks |
| `pnpm verify` | lint + typecheck + unit + build + smoke |

## Deploy (Fly.io)

Per-app configs (Docker build context = repo root):

- [`apps/api/fly.toml`](apps/api/fly.toml) → `tadading-api`
- [`apps/web/fly.toml`](apps/web/fly.toml) → `tadading-web`
- [`apps/worker/fly.toml`](apps/worker/fly.toml) → `tadading-worker`

One-time bootstrap (creates apps + Postgres attach prompts):

```bash
# install flyctl: https://fly.io/docs/flyctl/install/
fly auth login
pnpm fly:bootstrap
# finish Redis + secret steps printed by the script
pnpm fly:deploy
```

GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) deploys on pull requests when these **GitHub Environment `fly-preview` secrets** are set:

| Secret | Purpose |
|--------|---------|
| `FLY_API_TOKEN` | Deploy token (`fly tokens create deploy`) — required |
| `FLY_API_HEALTH_URL` | Optional override; default `https://tadading-api.fly.dev/health/ready` |

Until `FLY_API_TOKEN` exists in the `fly-preview` environment, the deploy job skips with a warning (does not fail CI). Once set, it deploys api → worker → web and waits for `/health/ready`.

Brand/origin defaults live in each `fly.toml`. Override with `fly secrets set` when you attach a custom domain. The API runs database migrations on boot.

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

**Phase 2 — Attempts, streaks, events** (current): attempt persistence, guest streaks, transactional outbox, BullMQ dispatcher, spoiler-free share.

- Web: `/` → `/tutorial` → `/play` (local board + streak + share card)
- API: attempt start/save/complete/hint; `GET /v1/attempts/:id` includes outbox event ids/trace
- Worker: outbox → BullMQ → inbox dispatch
