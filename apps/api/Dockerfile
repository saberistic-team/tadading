FROM node:22-alpine AS base
RUN npm install -g pnpm@11.20.0
WORKDIR /app
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY packages ./packages
COPY apps/api ./apps/api
# trust-lockfile: skip registry re-verification (flaky in Docker builds)
RUN pnpm install --frozen-lockfile --config.trust-lockfile=true \
  --fetch-retries 5 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 \
  --filter @tadading/api...

FROM deps AS build
RUN pnpm --filter @tadading/api... build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SERVICE_NAME=api
ENV PORT=3001
COPY --from=build /app /app
EXPOSE 3001
CMD ["node", "apps/api/dist/main.js"]
