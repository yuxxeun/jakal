FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY . .

RUN npm run build 2>/dev/null || echo "No build script found, continuing..."

FROM node:18-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs
RUN adduser -S jakal -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=jakal:nodejs /app/dist ./dist 2>/dev/null || echo "No dist folder"
COPY --from=builder --chown=jakal:nodejs /app/build ./build 2>/dev/null || echo "No build folder"
COPY --from=builder --chown=jakal:nodejs /app/public ./public 2>/dev/null || echo "No public folder"

COPY --chown=jakal:nodejs . .

RUN mkdir -p /app/logs && chown jakal:nodejs /app/logs

USER jakal

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { \
    process.exit(res.statusCode === 200 ? 0 : 1) \
  }).on('error', () => process.exit(1))"


ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "npm start 2>/dev/null || node server.js 2>/dev/null || npx serve -s build -l 3000 2>/dev/null || npx serve -s dist -l 3000 2>/dev/null || npx serve -s public -l 3000"]
