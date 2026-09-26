# ERgency

ERgency is a clinician-reviewed emergency-department intake copilot. It helps
people communicate what brought them to the department, then gives clinicians a
clear, source-preserving brief to review before they make any decision.

The tablet check-in is voice-first: ERgency asks neutral questions aloud, and
the person checks and can edit the resulting text before submitting a write-once
account. A written form is also available. In the clinician workspace, staff
review the original account and draft, correct it where needed, record the
priority and next step, and sign it off.

The product is described in full, including what it deliberately does not do, in
[PRODUCT_GOAL.md](PRODUCT_GOAL.md).

> **Not a medical device.** This is a hackathon demonstration. It has not been
> clinically validated, the draft generator is a local keyword matcher rather
> than a validated model, and it must not be used with real patients. The
> priority labels are placeholders until a department confirms its own scale.

## The workflow

1. **Capture the person’s account** — the tablet starts a voice-first browser
   check-in. The Realtime provider processes microphone audio to speak and
   transcribe during that session; ERgency does not record audio and submits
   only text the person has confirmed. A written form is always available, and
   the tablet cannot read the clinical workspace.
2. **Create a reviewable brief** — a server-only composition boundary organises
   the account into a source-preserving draft, falling back safely to local
   deterministic rules.
3. **Support, never replace, review** — a separate source-linked model pass can
   surface where to start in the active review list. Every report remains
   openable; the order is not a clinical priority or decision.
4. **Keep decisions with clinicians** — a clinician edits the draft and chooses
   a priority and next step. ERgency pre-selects neither.
5. **Create an accountable handover** — the signed-off brief becomes a
   read-only record naming the clinician who approved it.

## The safety boundaries, and where they are enforced

These are not conventions. Each one is a database constraint or grant, so a bug
in the application cannot cross them.

| Boundary | Enforced by |
| --- | --- |
| Clinical priority remains clinician-owned | `triage_briefs.priority` is clinician-supplied; the priority inputs have no default |
| A suggested review order is auditable | `review_suggestions` stores source-linked reasons, staff may only read it, and a database trigger freezes a saved model suggestion |
| Nothing is approved without a decision | `approval_requires_a_decision` CHECK constraint |
| No decision without a named clinician | `decisions_carry_a_reviewer` CHECK constraint |
| Approval is irreversible | The UPDATE policy can only see rows still in draft, **and** a `BEFORE UPDATE` trigger refuses to touch an approved row for any role (RLS alone is not enough — the table owner and `service_role` both have `BYPASSRLS`) |
| A captured intake cannot be rewritten | `encounters` has no UPDATE grant and no UPDATE policy |
| What the patient said cannot be edited during review | `patient_reported` and `staff_observed` are absent from the UPDATE grant |
| Records name clinical decision-makers | `reviewed_by`, readable label snapshot, staff-role audit and a nullable source marker for anonymous tablet capture |
| Accounts cannot be deleted out from under a record | `ON DELETE RESTRICT` on every reference |
| Patient identity is minimised | No name, date of birth or contact detail is stored at all |

ERgency is designed to make AI assistance inspectable and accountable: it
preserves the person’s source account, flags reviewable gaps or conflicts, and
leaves clinical judgement and approval with a named clinician. The design
package is in [docs/README.md](docs/README.md).

The implemented path is `/` for voice-first tablet check-in, `/check-in` for
the written/voice-transcript confirmation form, `/queue` for staff reports, and
`/encounters/[id]` for clinician review and approved handover. See
[the implementation contract](docs/33-tablet-clinician-workflow.md) for the
data-access, AI, speech, and role boundaries.

Hackathon data is synthetic and fictional. Do not enter real patient health
information. ERgency must not diagnose, prescribe, assign an Australasian
Triage Scale category, or present model output as clinical truth. Its suggested
review order is an inspectable starting view only; a clinician reviews and
approves every brief.

### Future wearable path — architecture only

The demo may show one **simulated**, timestamped device-reported heart-rate value in a clinician record. It is not clinically verified, is never sent to either AI pass, and cannot influence a priority, next step, queue order, diagnosis, or safety conclusion.

A future live integration would require a patient-authorised native iPhone companion to read selected Apple Health/HealthKit data and submit a one-time snapshot to ERgency. Android Health Connect would be a separate later path. This browser app does not connect to watches or other devices, and it does not include Jev, a Jev API key, or any other wearable vendor integration. Any real-patient version needs clinical, privacy, security, consent, and vendor data-processing review before development.

### Known mismatches between `docs/` and the code

- **Product name.** The public product name is *ERgency*. The npm package, GitHub repository, and migration identifiers remain `er-triage` as technical identifiers.
- **Triage scale.** The docs specify the *Australasian* Triage Scale. The code now presents the chosen four-level clinician scale: Immediate, Urgent, Soon, and Non-urgent / go home. No category is ever assigned by the app; a clinician must select a value with no default.
- **Draft generation.** `lib/draft-brief.ts` remains a deterministic local keyword matcher. A separately validated, optional model pass may organise a draft or attach source-linked review suggestions; no model output records a clinician priority or approval.

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

## Loading the hosted demonstration data

[`supabase/demo/reset-demo.sql`](supabase/demo/reset-demo.sql) resets the
dedicated hackathon database to 14 fictional tablet submissions: six awaiting
clinician review and eight approved, read-only handover records. It deliberately
deletes all existing rows from `public.encounters` and `public.triage_briefs`,
but leaves staff accounts, staff roles, and role-audit history intact.

Run it manually in the demo project's Supabase SQL Editor only. Before running,
replace its two confirmation placeholders with the exact confirmation phrase and
the email of the existing clinician account that will present the demo. The
script refuses to continue unless that account already has the clinician role.
Never use the reset in a healthcare, patient, or mixed-data database.

## Project Layout

```text
app/                        Next.js App Router pages and actions
  encounters/[id]/          Review screen and approved handover record
  check-in/                 Anonymous tablet capture action
  queue/                    Shared department queue
components/                 Shared UI and forms
lib/
  brief-composition.ts      Server-only model boundary with deterministic fallback
  draft-brief.ts            Deterministic fallback. Not a clinical instrument.
  review-recommendation.ts  Source-linked suggested review ordering
  triage.ts                 Clinician decision vocabulary
  validation.ts             Input schemas mirroring the database constraints
supabase/migrations/        Schema, grants, row level security
tests/                      Unit tests
scripts/test-integration.ts Local-only end-to-end verification
```

## Template Source

This project was initialized from [justus-lumin/SaaSathon-Template](https://github.com/justus-lumin/SaaSathon-Template) and is synced to `nkrishnasridhar/er-triage`.
