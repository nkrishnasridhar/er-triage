# ADR-003: One Next.js application

## Status

Accepted for the SaaSathon MVP and as the default production shape.

## Context

The starter is Next.js, Supabase, Tailwind, Zod, and pnpm. SaaSathon recommends Vercel and Supabase, and Railway only for work that does not fit serverless. The team has about 15 hours of build time after sleep and meals. `AGENTS.md` says to prefer one complete feature over layers of abstraction.

## Decision

Ship a single Next.js app. Server Components read. Server Actions mutate. The model is called from the server. Supabase is the only datastore. Do not add a worker, a Python service, or a microservice per pipeline step.

## Alternatives

- Railway worker for compose. Deferred until a measured timeout cannot be fixed by a shorter prompt.
- Separate AI gateway. Rejected: one more secret and one more outage.
- Client-side model calls. Rejected: key exposure and prompt tampering.

## Consequences

Compose must finish inside the host's function limit or fail cleanly. Long agent loops are out of scope. Production documents in `08-system-architecture-production.md` keep the monolith until a real constraint appears.
