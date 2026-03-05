# Stage 1: Build (의존성 설치 및 빌드)
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# 패키지 매니저 파일들 먼저 복사 (캐시 활용)
COPY package.json package-lock.json* ./
RUN npm install

# 전체 소스 복사 및 빌드
COPY . .
RUN npm run build

# Stage 2: Run (경량 실행 환경)
# ----------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# 보안 및 성능을 위해 환경 변수 설정
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# 빌드 스테이지에서 생성된 필수 파일만 복사 (Standalone 활용)
# Next.js 설정에서 output: 'standalone'이 켜져 있어야 합니다.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# 헬스체크 (Next.js 기본 포트 기준)
RUN apk add --no-cache curl
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
