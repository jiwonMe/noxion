FROM oven/bun:1.3 AS base
WORKDIR /app

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json bun.lock bunfig.toml turbo.json tsconfig.base.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/renderer/package.json ./packages/renderer/
COPY packages/adapter-nextjs/package.json ./packages/adapter-nextjs/
COPY packages/create-noxion/package.json ./packages/create-noxion/
COPY apps/web/package.json ./apps/web/
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/renderer/node_modules ./packages/renderer/node_modules
COPY --from=deps /app/packages/adapter-nextjs/node_modules ./packages/adapter-nextjs/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run --filter=@noxion/core build && \
    bun run --filter=@noxion/renderer build && \
    bun run --filter=@noxion/adapter-nextjs build && \
    bun run --filter=@noxion/web build

# Stage 3: Production runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:bun /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "apps/web/server.js"]
