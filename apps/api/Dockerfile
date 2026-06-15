# ─── Stage 1: install dependencies ───────────────────────────────────────────
# Only the packages the API actually needs.
# packages/ui is intentionally omitted — it pulls in Next.js, React and all
# Radix components which adds hundreds of MB and stalls npm on low-RAM VPS.
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json        ./
COPY apps/api/package.json                 ./apps/api/
COPY packages/shared/package.json          ./packages/shared/
COPY packages/tsconfig/package.json        ./packages/tsconfig/

RUN npm ci --ignore-scripts --no-audit --no-fund


# ─── Stage 2: build ───────────────────────────────────────────────────────────
FROM deps AS builder
WORKDIR /app

COPY packages/tsconfig ./packages/tsconfig
COPY packages/shared   ./packages/shared
COPY apps/api          ./apps/api

# Prisma generate must run BEFORE nest build:
# provider = "prisma-client" emits TypeScript files into src/generated/prisma,
# which tsc then compiles into dist/generated/prisma together with the rest.
RUN cd apps/api && npx prisma generate --schema=prisma/schema.prisma

# Build @repo/shared first (api imports from it), then the api itself.
RUN npm run build --workspace=@repo/shared
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build --workspace=api

# Drop devDependencies before we copy node_modules into the runner.
RUN npm prune --omit=dev --ignore-scripts


# ─── Stage 3: production runner ───────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat dumb-init

ENV NODE_ENV=production
ENV PORT=3001
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nestjs

# node_modules contains workspace symlink: @repo/shared → ../../packages/shared
COPY --from=builder --chown=nestjs:nodejs /app/node_modules          ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json          ./package.json

# API compiled output + prisma schema (needed for prisma migrate deploy)
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist         ./apps/api/dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma       ./apps/api/prisma

# Shared package — symlink target must exist in the runner
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared       ./packages/shared

USER nestjs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD node -e "const h=require('http');const r=h.get('http://localhost:3001/health',res=>{process.exit(res.statusCode===200?0:1)});r.on('error',()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "apps/api/dist/main.js"]
