#!/usr/bin/env bash
# One-time Fly.io bootstrap for TadaDing (apps + managed Postgres/Redis attach).
# Prerequisites: flyctl installed and authenticated (`fly auth login`).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v fly >/dev/null 2>&1 && ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl not found. Install: https://fly.io/docs/flyctl/install/" >&2
  exit 1
fi

FLY=fly
command -v fly >/dev/null 2>&1 || FLY=flyctl

ORG="${FLY_ORG:-personal}"
REGION="${FLY_REGION:-iad}"
PG_APP="${FLY_POSTGRES_APP:-tadading-db}"
REDIS_NAME="${FLY_REDIS_NAME:-tadading-redis}"

API_APP="tadading-api"
WEB_APP="tadading-web"
WORKER_APP="tadading-worker"

ensure_app() {
  local app="$1"
  if "$FLY" status -a "$app" >/dev/null 2>&1; then
    echo "    $app already exists"
  else
    "$FLY" apps create "$app" --org "$ORG"
  fi
}

echo "==> Creating Fly apps"
ensure_app "$API_APP"
ensure_app "$WEB_APP"
ensure_app "$WORKER_APP"

echo "==> Postgres cluster: $PG_APP"
if "$FLY" status -a "$PG_APP" >/dev/null 2>&1; then
  echo "    $PG_APP already exists"
else
  "$FLY" postgres create \
    --name "$PG_APP" \
    --org "$ORG" \
    --region "$REGION" \
    --vm-size shared-cpu-1x \
    --volume-size 1 \
    --initial-cluster-size 1
fi

echo "==> Attach Postgres → $API_APP / $WORKER_APP (sets DATABASE_URL)"
"$FLY" postgres attach "$PG_APP" --app "$API_APP" || true
"$FLY" postgres attach "$PG_APP" --app "$WORKER_APP" || true

cat <<EOF
==> Upstash Redis via Fly ($REDIS_NAME)
    If you have not created Redis yet, run interactively:
      $FLY redis create --name $REDIS_NAME --org $ORG --region $REGION
    Then set REDIS_URL on api + worker:
      $FLY redis status $REDIS_NAME   # copy private URL
      $FLY secrets set REDIS_URL='rediss://...' -a $API_APP
      $FLY secrets set REDIS_URL='rediss://...' -a $WORKER_APP

==> App secrets (HMAC secrets required)
      $FLY secrets set \\
        PUZZLE_SEED_SECRET='...' \\
        GUEST_HMAC_SECRET='...' \\
        -a $API_APP
      $FLY secrets set \\
        PUZZLE_SEED_SECRET='...' \\
        GUEST_HMAC_SECRET='...' \\
        -a $WORKER_APP

    Optional brand/origin overrides (defaults live in apps/*/fly.toml):
      $FLY secrets set WEB_ORIGIN=https://$WEB_APP.fly.dev API_ORIGIN=https://$API_APP.fly.dev -a $API_APP

==> First deploy
      pnpm fly:deploy

Done bootstrap scaffolding. Complete Redis + secrets steps above before deploy.
EOF
