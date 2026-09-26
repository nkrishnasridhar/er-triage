# ER Triage

ER Triage turns a patient's opening account in an emergency department into a
**clinician-reviewed** triage brief: staff capture what the patient says and what
can be observed, a draft brief organises that text, and a qualified clinician
corrects it, sets the priority and the next step, and signs it off.

The product is described in full, including what it deliberately does not do, in
[PRODUCT_GOAL.md](PRODUCT_GOAL.md).

> **Not a medical device.** This is a hackathon demonstration. It has not been
> clinically validated, the draft generator is a local keyword matcher rather
> than a validated model, and it must not be used with real patients. The
> priority labels are placeholders until a department confirms its own scale.

## The workflow

1. **Record** — a nurse captures the patient's account in their own words, plus
   anything observable. No interpretation and no prioritising at this stage.
2. **Draft** — a brief is organised from that text, keeping the source of every
   line visible and listing what the notes left unanswered.
3. **Review** — a clinician edits the draft and chooses a priority and a next
   step. Nothing is pre-selected.
4. **Hand over** — the signed-off brief becomes a read-only record naming the
   clinician who approved it.

## The safety boundaries, and where they are enforced

These are not conventions. Each one is a database constraint or grant, so a bug
in the application cannot cross them.

| Boundary | Enforced by |
| --- | --- |
| The app never assigns urgency | `triage_briefs.priority` is clinician-supplied; the priority inputs have no default |
| Nothing is approved without a decision | `approval_requires_a_decision` CHECK constraint |
| No decision without a named clinician | `decisions_carry_a_reviewer` CHECK constraint |
| Approval is irreversible | The UPDATE policy can only see rows still in draft |
| A captured intake cannot be rewritten | `encounters` has no UPDATE grant and no UPDATE policy |
| What the patient said cannot be edited during review | `patient_reported` and `staff_observed` are absent from the UPDATE grant |
| Records name the people responsible | `recorded_by`, `drafted_by`, `reviewed_by`, plus readable label snapshots |
| Accounts cannot be deleted out from under a record | `ON DELETE RESTRICT` on every reference |
| Patient identity is minimised | No name, date of birth or contact detail is stored at all |

## Getting Started

You need Node.js 22+, pnpm 10 and Docker for local Supabase.

```sh
pnpm install
cp .env.example .env.local
```

Start the local Supabase stack and apply the migrations:

```sh
pnpm db:start
pnpm db:reset
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

`pnpm test` covers the input validation schemas and the draft generator.
`pnpm test:integration` boots the built app against the local stack and checks
the safety boundaries above over real HTTP, including a refused approval with no
clinician decision and the immutability of an approved record.

## Project Layout

```text
app/                        Next.js App Router pages and actions
  encounters/[id]/          Review screen and approved handover record
  intake/                   Guided intake capture
  queue/                    Shared department queue
components/                 Shared UI and forms
lib/
  draft-brief.ts            Local draft generator. Not a clinical instrument.
  triage.ts                 Clinician decision vocabulary
  validation.ts             Input schemas mirroring the database constraints
supabase/migrations/        Schema, grants, row level security
tests/                      Unit tests
scripts/test-integration.ts Local-only end-to-end verification
```

## Template Source

This project was initialized from [justus-lumin/SaaSathon-Template](https://github.com/justus-lumin/SaaSathon-Template) and is synced to `nkrishnasridhar/er-triage`.
