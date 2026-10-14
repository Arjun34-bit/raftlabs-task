# Architecture decisions

## Modular monolith

One deployable API keeps operations simple while routes, domain services, repositories, and jobs remain independently testable. The current traffic and team size do not justify distributed-system overhead.

## PostgreSQL

Orders must survive restarts and require transactions, constraints, conditional updates, and auditable history. PostgreSQL provides those guarantees without application-level substitutes.

## Integer currency

All monetary values use paise. This avoids floating-point rounding and makes totals deterministic. The API looks up current prices and stores item snapshots inside the order transaction.

## SSE over WebSockets

Tracking is server-to-client only. SSE provides automatic browser reconnection and a smaller operational surface. The page always fetches current state first, so events are an optimization rather than the source of truth.

## Explicit state machine

Allowed transitions are centralized and database updates include the expected old state. This rejects backwards changes and prevents two concurrent requests from both succeeding against stale state.

## AI-assisted development

AI accelerated scaffolding, test enumeration, responsive styling, and documentation. Output was checked with strict TypeScript, automated tests, production builds, and manual review of security boundaries and transaction behavior. AI did not replace verification; compiler and test feedback drove corrections.
