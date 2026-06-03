# Express + TypeScript Backend Template

A production-ready backend template using Express 5, Mongoose, and TypeScript.

[![Node](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js)](package.json)
[![Express](https://img.shields.io/badge/express-5-000?logo=express)](package.json)
[![TypeScript](https://img.shields.io/badge/typescript-latest-3178C6?logo=typescript)](package.json)
[![MongoDB](https://img.shields.io/badge/mongodb-mongoose-47A248?logo=mongodb)](package.json)

## Stack

- **Runtime** Node.js with TypeScript (compiled via `tsgo`)
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

# start development server with hot reload
pnpm dev
```

## Scripts

| Command          | Description                      |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Run with hot reload (tsx watch)  |
| `pnpm build`     | Compile TypeScript with tsgo     |
| `pnpm start`     | Run compiled output              |
| `pnpm typecheck` | Type-check without emitting      |
| `pnpm lint`      | Lint with oxlint                 |
| `pnpm format`    | Format with oxfmt                |
| `pnpm check`     | Type-check + lint + format check |

## Project Structure

```
src/
├── controllers/     # Request handlers
├── database/        # Database connection
├── helpers/         # Shared utilities (errors, response types)
├── libs/            # Config (env, logger)
├── middlewares/      # Express middlewares
├── models/          # Mongoose schemas & types
├── routers/         # Route definitions
├── services/        # Business logic
└── index.ts         # App entry point
```
