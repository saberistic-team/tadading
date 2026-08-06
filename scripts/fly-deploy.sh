#!/usr/bin/env bash
# Deploy api → worker → web to Fly.io from the monorepo root.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v fly >/dev/null 2>&1 && ! command -v flyctl >/dev/null 2>&1; then
  echo "flyctl not found. Install: https://fly.io/docs/flyctl/install/" >&2
  exit 1
fi

FLY="${FLY_BIN:-}"
if [ -z "$FLY" ]; then
  if command -v fly >/dev/null 2>&1; then
    FLY=fly
  else
    FLY=flyctl
  fi
fi

REMOTE_ONLY="${FLY_REMOTE_ONLY:---remote-only}"

deploy_one() {
  local config="$1"
  echo "==> Deploying $config"
  "$FLY" deploy $REMOTE_ONLY --config "$config"
}

# API first so migrations run on boot before worker/web traffic.
deploy_one apps/api/fly.toml
deploy_one apps/worker/fly.toml
deploy_one apps/web/fly.toml

echo "==> Waiting for API /health/ready"
API_HEALTH_URL="${FLY_API_HEALTH_URL:-https://tadading-api.fly.dev/health/ready}"
for i in $(seq 1 60); do
  if curl -fsS "$API_HEALTH_URL" >/tmp/fly-ready.json 2>/dev/null; then
    if node -e "const b=JSON.parse(require('fs').readFileSync('/tmp/fly-ready.json','utf8')); if(b.status!=='ready') process.exit(2);"; then
      echo "API ready: $API_HEALTH_URL"
      exit 0
    fi
  fi
  echo "Attempt $i: not ready yet"
  sleep 5
done

echo "Timed out waiting for $API_HEALTH_URL" >&2
exit 1
