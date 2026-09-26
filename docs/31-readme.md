# Front Brief

Front Brief is an intake copilot for the first minutes of an emergency-department presentation. A triage nurse pastes a messy conversation. The product returns a brief the nurse can review: what the patient reported, what staff observed, what context was provided, what the software only highlighted, what is still unanswered, and what the nurse changed or approved.

It does not diagnose, prescribe, assign an Australasian Triage Scale category, rank patients, decide who is seen first, or determine disposition. Model output is not clinical truth.

This repository is the SaaSathon starter (`er-triage`) plus the specification in `/docs`. The public name is Front Brief so it is not confused with CAREPOI's ERTRIAGE product.

## Status

Documentation is in [docs/README.md](README.md). Application behaviour is still the starter until an implementation pass follows [04-mvp-scope.md](04-mvp-scope.md). Do not enter real patient information. Hackathon use is fictional patients and one demo clinician.

## Demo boundaries

- Synthetic data only.
- Typed or pasted transcript. No live microphone on the critical path.
- The category field starts empty and only the clinician can set it.
- At most three clarification questions, and they never block approval.
- Highlights are questions or pointers to source text, not new clinical assertions.

## Stack, when implementation starts

Next.js App Router, TypeScript, Tailwind v4, Zod, Supabase, pnpm. One application. Server Components for reads, Server Actions for mutations. The model is called from the server. Assembly of the brief is deterministic code.

Setup commands for the starter are in the root [README.md](../README.md).

## Repository map for the build

```text
app/encounters/            pages and server actions
lib/encounters/            schema, prompts, assembler, fixtures
supabase/migrations/       additive SQL only
tests/                     schema and assembler tests
docs/                      this specification
```

## Safety

Read [14-safety-case.md](14-safety-case.md) before changing the review screen. That file is an engineering exercise, not a clinical safety case. Read [32-cto-decision-summary.md](32-cto-decision-summary.md) before adding a feature. If a change lets the model write a triage category, a score, or a diagnosis, it is out of scope.

## Licence and data

Follow the repository licence and `THIRD_PARTY_NOTICES.md`. Do not commit `.env.local`, API keys, or demo passwords.
