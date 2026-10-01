FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL=https://api.kalkisenatimes.com/api/v1/en
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_URL=https://api.kalkisenatimes.com/api/v1/en
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 8093
CMD ["npm", "start"]
