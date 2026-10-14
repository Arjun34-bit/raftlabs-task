# FeastFleet Order Management

A production-minded food ordering demo for the RaftLabs Senior Full Stack assessment. Customers can browse a seeded menu, manage a persistent cart, check out, and follow an opaque tracking link as the order advances in real time. A separate development console supports manual status changes.

## Stack

- Next.js 15, React 19, TypeScript, TanStack Query, Zustand, React Hook Form and Zod
- Express, PostgreSQL, Drizzle ORM, Server-Sent Events
- Vitest and React Testing Library

## Architecture

This npm-workspaces monorepo contains `apps/web`, `apps/api`, and `packages/shared`. The API follows route → service → repository → PostgreSQL. Prices are stored as integer paise and recalculated from the database during checkout. Order items retain price/name snapshots. Status changes use a guarded state machine and conditional database updates.

## Local setup

Requirements: Node.js 20+, PostgreSQL, and npm.

```bash
cp .env.example .env
npm install
npm run db:migrate -w @raftlabs/api
npm run db:seed -w @raftlabs/api
npm run dev
```

Create the PostgreSQL database before running migrations. The default local
configuration connects to `localhost:5433` using the database and credentials
declared by `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in
the repository-level `.env` file.

Production defaults PostgreSQL connections to TLS. Set `NODE_ENV=production`
and provide `DATABASE_URL`; use `DB_SSL=require` to make the requirement
explicit. `DB_SSL=disable` is available only for deployments whose database
endpoint intentionally does not support TLS.

Migrations are applied in filename order from `apps/api/src/db/migrations`.
Applied filenames are recorded in `schema_migrations`, so rerunning the command
is safe and only pending table changes are executed.

Open `http://localhost:3000`. The API runs on `http://localhost:4000`; the development order console is at `http://localhost:3000/demo/orders`.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

## API

All routes use `/api/v1`:

- `GET /menu`, `GET /menu/:id`
- `POST /orders` (supports `Idempotency-Key`)
- `GET /track/:trackingId`, `GET /track/:trackingId/events`
- Admin: `GET /orders`, `GET/PATCH/DELETE /orders/:id`, `PATCH /orders/:id/status`, `GET /orders/:id/history`
- `GET /health`

Admin routes are open only in development; production requires `x-admin-key`. Public tracking deliberately omits the customer phone number.

## Status model

`RECEIVED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`. Orders may move to `CANCELLED` from `RECEIVED` or `PREPARING`. Demo mode stores `next_transition_at` in PostgreSQL and polls due work, so a process restart does not lose the schedule.

## Known limitations

- Authentication and payment are outside assessment scope.
- The polling worker assumes one service instance. Multiple instances need a lease, advisory lock, or queue.
- An opaque UUID protects tracking links, but customer authentication would be required for stronger privacy guarantees.
- Deployment URLs and the walkthrough recording must be added after hosting.

See [architecture decisions](docs/decisions.md) for trade-offs and AI usage.
