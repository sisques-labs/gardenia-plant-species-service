# Gardenia Plant Species Service

Plant species microservice for Gardenia. NestJS + TypeScript, organized with
**DDD + CQRS + Hexagonal** architecture by bounded context, mirroring the
conventions of `gardenia-api`.

## Architecture

```
src/
├── core/                 # cross-cutting: config, filters, health
│   ├── config/           # env validation (zod), postgres, app, cors
│   ├── filters/          # BaseExceptionFilter
│   └── health/           # liveness probe (REST)
├── support/              # logging (winston)
├── database/             # TypeORM data-source + migrations
└── contexts/
    └── plant-species/    # bounded context (DDD layout)
        ├── application/   # commands, queries, ports, services
        ├── domain/        # aggregates, value-objects, events, repositories…
        ├── infrastructure/# persistence (typeorm), adapters
        └── transport/     # rest, graphql, mcp
```

Cross-context imports are enforced by `eslint-plugin-boundaries`: a context may
only reach another through a port + adapter.

## Getting started

```bash
pnpm install
docker compose up -d        # local postgres on :5436
pnpm dev                    # http://localhost:3000/api  (docs at /docs)
```

## Environment

| Variable             | Required | Default                 | Notes                                  |
| -------------------- | -------- | ----------------------- | -------------------------------------- |
| `NODE_ENV`           | no       | `development`           |                                        |
| `PORT`               | no       | `3000`                  |                                        |
| `CORS_ORIGINS`       | no       | —                       | Comma-separated; falls back to FRONTEND_URL |
| `FRONTEND_URL`       | no       | `http://localhost:3001` |                                        |
| `DATABASE_DRIVER`    | no       | `postgres`              |                                        |
| `DATABASE_HOST`      | yes      | —                       |                                        |
| `DATABASE_PORT`      | no       | `5432`                  | docker-compose exposes `5436`          |
| `DATABASE_USERNAME`  | yes      | —                       |                                        |
| `DATABASE_PASSWORD`  | yes      | —                       |                                        |
| `DATABASE_DATABASE`  | yes      | —                       |                                        |

## Scripts

| Command                     | Description                          |
| --------------------------- | ------------------------------------ |
| `pnpm dev`                  | Watch mode                           |
| `pnpm build` / `pnpm prod`  | Compile / run compiled               |
| `pnpm lint`                 | ESLint + boundaries                  |
| `pnpm test` / `pnpm test:e2e` | Unit / e2e tests                   |
| `pnpm migration:generate`   | Generate a TypeORM migration         |
| `pnpm migration:run`        | Run pending migrations               |
| `pnpm test:db:up/down`      | Start/stop the test postgres         |
