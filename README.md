# ER Triage

ER Triage turns a patient's opening account in an emergency department into a
**clinician-reviewed** triage brief. A patient may start on a tablet, answering
plain-language questions and up to two locally selected follow-ups. Staff match
the resulting check-in code to their local reference, then a qualified clinician
reviews the draft, sets the priority and next step, and signs it off.

The product is described in full, including what it deliberately does not do, in
[PRODUCT_GOAL.md](PRODUCT_GOAL.md).

> **Not a medical device.** This is a hackathon demonstration. It has not been
> clinically validated, the draft generator is a local keyword matcher rather
> than a validated model, and it must not be used with real patients. The
> priority labels are placeholders until a department confirms its own scale.

## The workflow

1. **Check in** — a patient uses the tablet to give their first account. The
   questions do not diagnose or assign urgency. Staff can still use the manual
   intake path when a tablet is unsuitable.
2. **Match and draft** — staff match the tablet's short code to a local patient
   reference. A brief is organised from the patient's answer text, keeping the source of every
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
| Approval is irreversible | The UPDATE policy can only see rows still in draft, **and** a `BEFORE UPDATE` trigger refuses to touch an approved row for any role (RLS alone is not enough — the table owner and `service_role` both have `BYPASSRLS`) |
| A captured intake cannot be rewritten | `encounters` has no UPDATE grant and no UPDATE policy |
| A tablet check-in cannot be rewritten or read back publicly | `patient_checkins` grants public INSERT only; it has no UPDATE, DELETE or public SELECT policy |
| What the patient said cannot be edited during review | `patient_reported` and `staff_observed` are absent from the UPDATE grant |
| Records name the people responsible | `recorded_by`, `drafted_by`, `reviewed_by`, plus readable label snapshots |
| Accounts cannot be deleted out from under a record | `ON DELETE RESTRICT` on every reference |
| Patient identity is minimised | No name, date of birth or contact detail is stored at all |

The product specified for this weekend is **Front Brief**, a clinician-reviewed emergency-department intake copilot. The design package is in [docs/README.md](docs/README.md).

The working application described above is now implemented: `/check-in` is the patient tablet flow, `/check-ins/[id]` is the authenticated staff handoff step, `/intake` is the manual staff fallback, `lib/draft-brief.ts` drafts a brief, and `/encounters/[id]` is the clinician review screen and approved handover record. The `docs/` package is the design intent; where it and the code disagree, the code is what runs and the disagreement needs resolving — see the open questions below.

Hackathon data is synthetic and fictional. Do not enter real patient health information. The product must not diagnose, prescribe, assign an Australasian Triage Scale category, rank patients, or present model output as clinical truth. A clinician reviews and approves every brief.

### Known mismatches between `docs/` and the code

- **Product name.** The docs say *Front Brief*; the UI, package and migrations say *ER Triage*. One name needs choosing.
- **Triage scale.** The docs specify the *Australasian* Triage Scale. The code ships the UK-style labels (Immediate / Very urgent / Urgent / Standard / Non-urgent) as placeholders. No category is ever assigned by the app, so this is a labelling decision, not a safety one — but it should be settled before any clinician sees it.
- **Adaptive questions and draft generation.** The code uses a deterministic local question selector (`lib/patient-check-in.ts`) and keyword matcher (`lib/draft-brief.ts`), not a hosted model. No model output is presented as clinical truth, so the provenance and human-oversight intent is preserved.

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
  check-in/                  Public patient tablet questionnaire
  check-ins/[id]/            Staff handoff from a tablet check-in to a draft
  encounters/[id]/          Review screen and approved handover record
  intake/                   Guided intake capture
  queue/                    Shared department queue
components/                 Shared UI and forms
lib/
  draft-brief.ts            Local draft generator. Not a clinical instrument.
  patient-check-in.ts       Local adaptive question guide. Not a clinical instrument.
  triage.ts                 Clinician decision vocabulary
  validation.ts             Input schemas mirroring the database constraints
supabase/migrations/        Schema, grants, row level security
tests/                      Unit tests
scripts/test-integration.ts Local-only end-to-end verification
```

## Template Source

This project was initialized from [justus-lumin/SaaSathon-Template](https://github.com/justus-lumin/SaaSathon-Template) and is synced to `nkrishnasridhar/er-triage`.
