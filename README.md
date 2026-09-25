# ER Triage

ER Triage is initialized from the [SaaSathon Starter](https://github.com/justus-lumin/SaaSathon-Template): a Next.js, TypeScript, Supabase, Tailwind and pnpm project foundation.

The product specified for this weekend is **Front Brief**, a clinician-reviewed emergency-department intake copilot. The design package is in [docs/README.md](docs/README.md). This pass is documentation only. Application behaviour is still the starter.

Hackathon data is synthetic and fictional. Do not enter real patient health information. The product must not diagnose, prescribe, assign an Australasian Triage Scale category, rank patients, or present model output as clinical truth. A clinician reviews and approves every brief.

## Getting Started

You need Node.js 22+, pnpm 10 and Docker for local Supabase.

```sh
pnpm install
cp .env.example .env.local
```

Start the local Supabase stack:

```sh
pnpm db:start
pnpm supabase status
```

Copy the local API URL and publishable key into `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55431
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-local-publishable-key
```

Run the app:

```sh
pnpm dev
```

Open [localhost:3000](http://localhost:3000). If another app is using port 3000, run `pnpm dev --port 3100`.

## Verification

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

With the local Supabase stack running:

```sh
pnpm test:integration
```

## Project Layout

```text
app/                        Next.js App Router pages and actions
components/                 Shared UI and forms
lib/                        Auth, config, validation and Supabase clients
supabase/                   Local Supabase config, migrations and email template
tests/                      Unit tests
scripts/test-integration.ts Local-only integration verification
```

## Template Source

This project was initialized from `justus-lumin/SaaSathon-Template` and is synced to `nkrishnasridhar/er-triage`.
