# SaaSathon Starter

Keep this a small, readable foundation. Prefer one complete feature over layers of abstractions.

- Use pnpm, TypeScript strict mode, Next.js App Router and Tailwind v4.
- Keep reads in Server Components; use Server Actions for mutations and small Client Components for interactive forms.
- Validate every action input. Derive ownership from verified authentication, never a submitted user ID.
- Every new public table needs a migration, grants, RLS and a two-account access test.
- Match the tokens in app/globals.css and reuse components/ui. Inter is the only bundled font; do not add unlicensed brand assets.
- Never commit .env.local, database credentials, tokens or private keys. Use public placeholders in .env.example.
- Use only a dedicated local/test database for tests. Never reset a linked/production database.
- Run pnpm lint, pnpm typecheck, pnpm test, pnpm build and, when Docker is available, pnpm test:integration.
- Do not provision paid services or additional production projects without the owner's approval.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
