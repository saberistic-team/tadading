FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.20.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY packages ./packages
COPY apps/worker ./apps/worker
RUN pnpm install --frozen-lockfile --filter @tadading/worker...

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
