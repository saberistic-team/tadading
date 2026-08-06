FROM node:22-alpine AS base
RUN npm install -g pnpm@11.20.0
WORKDIR /app
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY packages ./packages
COPY apps/worker ./apps/worker
# trust-lockfile: skip registry re-verification (flaky in Docker builds)
RUN pnpm install --frozen-lockfile --config.trust-lockfile=true \
  --fetch-retries 5 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 \
  --filter @tadading/worker...

FROM deps AS build
RUN pnpm --filter @tadading/worker... build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SERVICE_NAME=worker
ENV PORT=3002
COPY --from=build /app /app
EXPOSE 3002
CMD ["node", "apps/worker/dist/main.js"]
