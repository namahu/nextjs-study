FROM node:22-alpine AS base

# 1. 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. アプリケーションのビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# ビルド時に環境変数が必要な場合はここで渡す（NEXT_PUBLIC_* など）
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json ./
COPY prisma ./prisma
COPY prisma7.config.ts* ./
RUN npx prisma generate

COPY . .
RUN npm run build

# 3. Cloud Runにデプロイされる本番実行用イメージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Cloud Run はデフォルトでポート 8080 を待ち受ける
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
