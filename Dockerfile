# Stage 1: Build
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

COPY . .
RUN npm install
RUN npx prisma generate
RUN npm run lint
# RUN npm run test
RUN npm run build

# Stage 2: Production
FROM --platform=linux/amd64 node:20-alpine AS production

WORKDIR /app

COPY . .
# COPY --from=builder /app/package.json /app/package-lock.json ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/next.config.mjs ./next.config.mjs
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "start"]
