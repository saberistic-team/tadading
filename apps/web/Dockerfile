FROM node:22-alpine AS base
RUN npm install -g pnpm@11.20.0
WORKDIR /app
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.base.json .npmrc ./
COPY packages ./packages
COPY apps/web ./apps/web
# trust-lockfile: skip registry re-verification (flaky in Docker builds)
RUN pnpm install --frozen-lockfile --config.trust-lockfile=true \
  --fetch-retries 5 --fetch-retry-mintimeout 20000 --fetch-retry-maxtimeout 120000 \
  --filter @tadading/web...

FROM deps AS build
ARG BRAND_NAME=TadaDing
ARG PUBLIC_DOMAIN=localhost
ARG SOCIAL_HANDLE=playtadading
ARG TAGLINE="Your daily tiny win."
ARG NEXT_PUBLIC_API_ORIGIN=http://localhost:3101
ENV BRAND_NAME=$BRAND_NAME
ENV PUBLIC_DOMAIN=$PUBLIC_DOMAIN
ENV SOCIAL_HANDLE=$SOCIAL_HANDLE
ENV TAGLINE=$TAGLINE
ENV NEXT_PUBLIC_API_ORIGIN=$NEXT_PUBLIC_API_ORIGIN
RUN pnpm --filter @tadading/web... build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
