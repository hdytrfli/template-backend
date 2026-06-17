# setting the base image
FROM node:24-alpine AS base
RUN apk add --no-cache tini
RUN corepack enable
WORKDIR /app

# installing dependency
FROM base AS deps
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

# building the app
FROM base AS build
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# running the app
FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["tini", "--"]
CMD ["node", "dist/index.js"]
