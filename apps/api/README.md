# @declic/api

PocketBase backend. The `pocketbase` binary and `pb_data/` directory are **not** checked in.

## First-time setup

From the monorepo root:

```bash
yarn install
yarn --cwd apps/api setup
```

This downloads the pinned PocketBase version (see `scripts/setup.sh`) for your OS/arch.

## Run locally

```bash
yarn --cwd apps/api dev
# or from root via turbo
yarn dev
```

Admin UI: http://localhost:8090/_/

## Environment variables

- `REDIS_URL` — full Upstash/Redis connection string (required by `pb_hooks/utils/redis.pb.js`).

Add to `apps/api/.env` (gitignored) or export in your shell.

## Schema

- `pb_migrations/` — versioned schema migrations, applied on boot.
- `pb_data/` — runtime SQLite + uploads, **gitignored**; each developer has their own local data.
