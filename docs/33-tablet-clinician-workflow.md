# 33 — Tablet-to-clinician workflow

## Implemented boundary

The product has two separate surfaces:

1. **Voice-first tablet check-in (`/`)** is an anonymous, touch-first guided conversation. The assistant asks a small number of neutral questions aloud. A person must review the resulting text in the separate confirmation form (`/check-in`) before submitting it. The written form is also available directly. The submitted account is write-once. The tablet cannot read a report, queue, decision, or staff data.
2. **Staff workspace (`/queue`)** requires an authenticated staff account. Clinicians can correct the draft, record a priority and next step, and approve. Nurses and admins have a read-only view in this build.

The current build remains for fictional demonstration data only. The screen’s identity-minimisation copy and database limits do not make it suitable for real patient information.

## Voice, speech, and capture

The primary flow uses a browser WebRTC connection and an ephemeral server-issued Realtime session credential. The Realtime provider processes microphone audio to create a live transcription and speak the questions back. The app does not record or retain audio, does not expose the long-lived provider key, and stores only the text the person confirms by submitting. Microphone denial, connection failure, or a stopped conversation shows a clear route to the written form.

The written form remains fully usable without voice. A voice transcript is copied only into that editable form in browser session storage; it is not submitted until the person explicitly sends it. Speech fluency, accent, language, disability, silence, or use of the typed fallback is never supplied to the draft generator as a clinical feature and never changes a priority.

The guided assistant may organise the conversation but cannot diagnose, assess severity or urgency, assign a triage category, recommend a priority or next step, reassure, or infer an escalation request from symptoms. It only says to alert staff when the person explicitly asks for a staff member.

## AI composition boundary

`lib/brief-composition.ts` is server-only. When `OPENAI_API_KEY` and `OPENAI_MODEL` are configured, it submits the account as an untrusted data block and accepts only strict JSON containing an organisational concern summary, quoted recorded items, and neutral clarification questions. Captured patient/staff text is copied by application code rather than accepted from the model.

The validator rejects any response that mentions diagnosis, severity, urgency, triage, priority, next step, queue ranking, confidence, risk, ATS, or ESI. Provider failure, malformed JSON, unknown quotes, and unsafe content all fall back to `lib/draft-brief.ts`; no model error, prompt, credential, or raw response is sent to either user interface. `drafted_from` records `model-v1` or `deterministic-fallback-v1`.

The AI does **not** assign, recommend, preselect, colour-code, or reorder urgency. New reports stay in capture-time order until a clinician independently records a decision. Approved records may display that clinician-recorded priority, but it is never a system ranking.

## Data access and audit

Migration `20260926140000_tablet_clinician_workflow.sql` adds:

- `encounters.submission_source` and `speech_used`, with a nullable recorder only for tablet-originated records;
- `staff_profiles` (`clinician`, `nurse`, `admin`) and append-only `staff_role_audit`;
- an audited one-time `bootstrap_first_clinician()` function for the first authenticated demo account; later roles are provisioned by an operator;
- `capture_tablet_intake(...)`, the sole anonymous writer. It atomically creates the write-once encounter and locked draft without granting anonymous table access.

RLS permits role-bearing staff to read encounters and briefs, allows only clinicians to revise an unapproved brief, and leaves `encounters` without UPDATE rights. Existing CHECK constraints still require priority, next step, reviewer, label, and timestamp together, and the existing trigger still freezes an approved brief.

## Verification

`tests/brief-composition.test.ts` rejects clinical-decision language, fabricated quotes, and provenance rewrites. `scripts/test-integration.ts` is a Docker/local-Supabase test for anonymous capture, two clinician accounts, a read-only nurse, approval validation, record immutability, and the browser tablet-to-queue path.

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`. Run `pnpm test:integration` only against the dedicated local Supabase database; never reset a linked or production project.
