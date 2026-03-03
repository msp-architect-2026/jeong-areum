# ---------- Builder Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build


# ---------- Runner Stage ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV HOSTNAME=0.0.0.0 

# wget 설치 (헬스체크용)
RUN apk add --no-cache wget

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# 헬스체크 추가
HEALTHCHECK --interval=10s --timeout=3s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]