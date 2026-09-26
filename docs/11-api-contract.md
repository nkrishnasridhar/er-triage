# 11 — API contract

> **Implementation update — 26 September 2026:** The public mutation is the validated `submitTabletEncounter` Server Action, backed by `capture_tablet_intake(...)`; it returns only success/failure copy and never an encounter ID. The voice-first route may create an ephemeral Realtime session credential, but it has no database read/write capability. Desktop mutations still derive identity from the session and now require a `clinician` database role. The earlier transcript/revision operation list remains future design work.

## Recommendation

Implement these operations as Server Actions in `app/encounters/actions.ts`, with the function names below. They share validation and repository code. Do not also build a public REST API in the MVP.

The paths are the logical contract if a Route Handler is required later. A judge does not call them. The browser posts the action.

Every action:

- reads the user from the server Supabase client
- ignores any `userId` in the payload
- validates with Zod
- returns a discriminated union `{ ok: true, ... } | { ok: false, code, message }`
- uses the user-facing `message` strings from [06-ux-specification.md](06-ux-specification.md)

## Shared error codes

`UNAUTHENTICATED | NOT_FOUND | VALIDATION | EMPTY_TRANSCRIPT | TOO_LONG | MODEL_TIMEOUT | MODEL_INVALID | SCHEMA_INVALID | CONFLICT`

`NOT_FOUND` covers missing and not-owned. Same message: "That encounter is not available."

## Actions

### `createEncounter`

Input:

```typescript
const CreateEncounterInput = z.strictObject({
  displayName: z.string().trim().min(1).max(80),
  contextNote: z.string().trim().max(1000).default(""),
});
```

Effect: insert `encounters` with `owner_id = auth.uid()`, `synthetic = true`, `status = 'draft'`. Audit `encounter_created`.

Success: `{ ok: true, encounterId: string }`.

Logical path: `POST /api/encounters`.

### `saveTranscript`

Input: `{ encounterId: uuid, body: string }` with `body.length <= 20000`.

Effect: upsert `transcripts`. If status was `approved`, refuse with `CONFLICT` and message "Amend the approved brief before changing the conversation." If amend is not built, the approved transcript is frozen.

Audit `transcript_saved` with meta `{ charLength }` only.

Logical path: `PUT /api/encounters/:id/transcript`.

### `composeBrief`

Input: `{ encounterId: uuid }`.

Effect: pipeline in [07-system-architecture-mvp.md](07-system-architecture-mvp.md). No client-supplied brief is accepted. A client cannot post model JSON.

Success: `{ ok: true, briefId: string, revision: number }`.

On failure the transcript remains. Previous head brief remains.

Logical path: `POST /api/encounters/:id/compose`.

### `updateStatement`

Input:

```typescript
const UpdateStatementInput = z.strictObject({
  encounterId: z.string().uuid(),
  statementId: z.string().min(1).max(40),
  text: z.string().min(1).max(400),
  epistemicStatus: EpistemicStatusSchema,
  sourceKind: z.enum(["PATIENT_REPORTED", "STAFF_OBSERVED", "CONTEXT_PROVIDED"]),
});
```

Effect: load head, patch the statement, set `addedByClinician` true if text changed, new revision `source = 'edit'`, encounter status `composed` (or stays `composed`). Clears `approval` if it was set and amend exists; otherwise refuse when approved.

Audit `statement_edited` meta `{ statementId, revision }`.

Logical path: `PATCH /api/encounters/:id/statements/:statementId`.

### `addObservation`

Input: `{ encounterId, text }` max 400.

Effect: append a statement `sourceKind: STAFF_OBSERVED`, `speaker: staff`, `epistemicStatus: EXPLICIT`, `addedByClinician: true`, `topic: "observation"`, span `{ start: 0, end: 0, quote: text }` is **not** allowed because the span must be real. Recommendation: observations added by the nurse use a span convention the schema must allow.

Schema tension: spans require `end > start` and a transcript substring. A nurse-added observation may not exist in the transcript.

**Decision:** extend the statement with `addedByClinician: true` and allow a single span whose quote equals the observation text and whose start and end are both `0` only when `addedByClinician` is true. Assembler and Zod refinement:

```typescript
.superRefine((statement, ctx) => {
  if (statement.addedByClinician && statement.spans[0]?.start === 0 && statement.spans[0]?.end === 0) {
    if (statement.spans[0].quote !== statement.text) {
      ctx.addIssue({ code: "custom", message: "Added observation quote must match text" });
    }
    return;
  }
});
```

Update the JSON Schema description in implementation to match: `end` may equal `start` only for clinician-added observations. The published schema in doc 10 says `end > start` via Zod refine. **Implementers change that refine** to the rule in this section. Doc 10's general case still holds for model statements. This is the one intentional refinement: model spans are strict substrings; clinician-added observations are labelled and not fake quotes from the patient.

Audit `observation_added`.

### `dismissHighlight` and `dismissGap`

Input: `{ encounterId, id }`. Remove that item, new revision, audit accordingly. Gap dismiss does not block anything.

Should-build if the review screen can otherwise ignore them visually. Must-build is "they do not block approve", not a perfect dismiss animation.

### `recordAts`

Input:

```typescript
const RecordAtsInput = z.strictObject({
  encounterId: z.string().uuid(),
  category: z.enum(["1", "2", "3", "4", "5"]).nullable(),
});
```

Effect: set `clinicianAts` on the head payload to the category, `recordedBy` = session user id, `recordedAt` = now ISO, note const string. If `category` is null, clear `recordedBy` and `recordedAt`. New revision `source = 'edit'`. Do not call the model. Do not accept a reason string in the MVP (a reason field invites the nurse to ask the product to justify the number).

Audit `ats_recorded` meta `{ atsSet: boolean, revision }`.

This action is the only writer of `clinicianAts.category`.

Logical path: `POST /api/encounters/:id/ats`.

### `approveBrief`

Input: `{ encounterId }`.

Effect: require a head brief, set approval, encounter `status = 'approved'`, revision source `approve`, audit `approved`.

Allowed when `informationToClarify` is non-empty.

Success: `{ ok: true, revision: number }`.

Logical path: `POST /api/encounters/:id/approve`.

### `listEncounters` and `getEncounter`

Reads, not actions. Server Components call the repository.

`getEncounter` returns display name, status, context, transcript body, head brief or null, and audit trail summaries (event type, time, revision). It does not return other users' rows.

Logical paths: `GET /api/encounters`, `GET /api/encounters/:id`.

## Idempotency

Compose is not idempotent: each success creates a revision. Double-clicks disable the button until the action returns. If two requests race, the unique `(encounter_id, revision)` constraint fails one; that request retries with the next revision number once, then returns `CONFLICT` with the try-again copy.

## Model request is not an API

The browser cannot pass a system prompt, temperature, or model name. Those are constants in `lib/encounters/prompts.ts` and environment `OPENAI_MODEL`, defaulting to a small JSON-capable model the team selects on Saturday. Do not document a specific snapshot name here if the event credit account exposes a different one. The code reads the env var.

## Headers and auth

Cookie session from `@supabase/ssr`, as the starter. No bearer token in the MVP. No CORS for a third-party client.

## Status codes if a route is added later

| Condition | Status |
| --- | --- |
| Success | 200 |
| Validation | 400 |
| Unauthenticated | 401 |
| Not found or not owner | 404 |
| Approved freeze, revision conflict | 409 |
| Model failure | 502 with the generic message, no provider body |
