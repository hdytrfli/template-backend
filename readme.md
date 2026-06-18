# Express + TypeScript Backend Template

A production-ready backend template using Express 5, Mongoose, and TypeScript.

[![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js)](package.json)
[![Express](https://img.shields.io/badge/express-5-000?logo=express)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-latest-3178C6?logo=typescript)](package.json)
[![MongoDB](https://img.shields.io/badge/mongodb-mongoose-47A248?logo=mongodb)](package.json)

## Stack

- **Runtime** Node.js with TypeScript
- **Framework** Express 5
- **Database** MongoDB with Mongoose 9
- **Validation** Zod
- **Logging** Pino (production) / Morgan (development)
- **Security** Helmet, CORS
- **Linting** oxlint
- **Formatting** oxfmt

## Getting Started

```bash
# install dependencies
pnpm install

# copy and fill environment variables
cp .env.example .env

# copy and fill environment variables for production
cp .env.example .env.production

# start development server with hot reload
pnpm dev
```

## Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `pnpm dev`       | Run with hot reload (tsx watch)     |
| `pnpm build`     | Compile TypeScript with tsup        |
| `pnpm start`     | Run compiled output                 |
| `pnpm typecheck` | Type-check without emitting         |
| `pnpm lint`      | Lint with oxlint                    |
| `pnpm format`    | Format with oxfmt                   |
| `pnpm check`     | Type-check + lint + format check    |
| `pnpm fix`       | Fix the lint + format automatically |

## Docker

```bash
# build the image
docker build -t template-application .

# run container
docker run -d --name template-application -p 3000:3000 --env-file .env template-application

# run with compose
docker compose up -d
```

## GitHub Actions

Two workflows:

- **CI** runs on push to `main` — installs, type-checks, lints, tests, verifies build.
- **Deploy** runs on push to `deploy` — full pipeline: checks, tests, Docker build + push, and K3s rolling update.

Requires self-hosted runners with labels `builder` and `deployer`.

Configure these secrets in **Settings → Secrets and variables → Actions**:

| Secret            | Description                |
| ----------------- | -------------------------- |
| `DOCKER_REGISTRY` | Container registry URL     |
| `DOCKER_USERNAME` | Registry username          |
| `DOCKER_PASSWORD` | Registry password or token |
| `DOCKER_IMAGE`    | Docker image name          |
| `NAMESPACE`       | K3s namespace              |
| `SERVICE_NAME`    | K3s deployment name        |
| `KUBECONFIG`      | K3s kubeconfig content     |
| `BOT_TOKEN`       | Telegram bot token         |
| `CHAT_ID`         | Telegram chat ID           |
