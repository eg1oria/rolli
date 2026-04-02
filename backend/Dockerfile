FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
RUN mkdir -p uploads/products uploads/promotions
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
