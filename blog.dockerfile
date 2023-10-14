FROM node:18-alpine AS base
 
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune blog --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm dlx turbo run build --filter=blog

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs


COPY --from=installer /app/apps/blog/next.config.js .
COPY --from=installer /app/apps/blog/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/blog/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/blog/.next/static ./apps/blog/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/blog/public ./apps/blog/public

CMD node apps/docs/server.js