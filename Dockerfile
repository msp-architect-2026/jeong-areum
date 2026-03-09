# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run with nginx
FROM nginx:alpine AS runner
WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD sh -c "HOST=0.0.0.0 node /app/server.js & sleep 2 && nginx -g 'daemon off;'"
