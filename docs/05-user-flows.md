# 05 — User flows

> **Implementation update — 26 September 2026:** Start with the public tablet route: type or speak, correct the text, submit, and receive a neutral completion message. Only authenticated staff can open `/queue`; only clinicians can alter a draft or approve. See [33](33-tablet-clinician-workflow.md) for the implemented flow.

The nurse is the only actor. The model is a server step, drawn as a service. Flows use the names in [docs/README.md](README.md).

## Happy path

```mermaid
flowchart TD
  A[Open hosted URL] --> B[Sign in as seeded clinician]
  B --> C[Encounter list]
  C --> D[Open Mara Ellison or create encounter]
  D --> E[Read synthetic-data banner]
  E --> F[Paste transcript and save]
  F --> G[Compose brief]
  G --> H{Schema valid?}
  H -->|yes| I[Review screen]
  H -->|no| R[Keep transcript, show compose error]
  R --> F
  I --> J[Scan reported, observed, context]
  I --> K[Read highlights and source quotes]
  I --> L[See at most 3 clarifications]
  L --> M[Answer, dismiss, or ignore]
  J --> N[Edit any wrong statement]
  K --> N
  M --> N
  N --> O[ATS stays empty unless nurse selects]
  O --> P[Approve]
  P --> Q[Handover view]
```

Time budget on the happy path, once the transcript is ready: under two minutes of clicking. The model may take up to 25 seconds inside Compose. That budget is a demo target (**assumption**), aligned to NFR-002.

## Failure: empty transcript

```mermaid
flowchart TD
  A[Compose clicked] --> B{Transcript length 0?}
  B -->|yes| C[Do not call the model]
  C --> D["Add the conversation before asking for a brief."]
  B -->|no| E[Continue compose]
```

## Failure: model timeout or invalid JSON

```mermaid
flowchart TD
  A[Compose] --> B{Response by 25s and Zod parse?}
  B -->|no| C[Discard model text]
  C --> D[Leave last good brief if any]
  D --> E["The brief was not updated. The conversation is saved. Try again."]
  E --> F[Nurse can edit transcript or retry]
```

No partial statements are written. A half-parsed allergy is worse than a retry.

## Failure: prompt injection in the transcript

```mermaid
flowchart TD
  A[Samir transcript saved as data] --> B[Extractor prompt: transcript is untrusted]
  B --> C[Model returns JSON only]
  C --> D{Assembler checks}
  D --> E[Drop unknown keys including ats, diagnosis, score]
  D --> F[Drop statements whose quote is not in the transcript]
  D --> G[Ignore instructions that are not schema fields]
  E --> H[Review shows the injection line only if it is a quoted patient statement]
  F --> H
  G --> H
  H --> I[ATS control still empty]
```

The spoken line is not a system instruction. It may appear as `PATIENT_REPORTED` text if the model quotes it, with no special authority. The UI does not badge it as "system".

## Failure: contradiction

Mara says she has no chest pain and later describes tightness in the chest. Both statements persist, status `CONTRADICTED`, each with its span. The assembler does not pick a winner. The highlight, if any, is the question "These passages disagree. Which wording do you want to keep?" and not "Patient has chest pain".

## Failure: uncertain allergy

The penicillin sentence is one statement, status `UNCERTAIN`, text that preserves "thinks" and "not sure". The screen must not show a chip labelled only "Penicillin".

## Failure: clinician question taken as evidence

Jules's nurse asks "Any chest pain?". The patient says "No, it's my ankle." Allowed outputs:

- a `NEGATED` statement from the patient's "No"
- no statement at all for the question line

Forbidden: an `EXPLICIT` chest-pain statement sourced from the nurse's question.

## Failure: speech cannot be used

There is no mic on the critical path. The transcript screen tells the nurse to type. If a patient cannot speak, the nurse types observations as `STAFF_OBSERVED` context and what a companion said as `CONTEXT_PROVIDED` only when the nurse marks it as companion context. The product does not infer urgency from silence, accent, literacy, or language.

```mermaid
flowchart TD
  A[Conversation not capturable by paste] --> B[Nurse types what they observed]
  B --> C[Optional: nurse types what the patient communicated by other means]
  C --> D[Compose]
  D --> E[Observed lines are STAFF_OBSERVED]
  E --> F[Missing history becomes gaps or UNKNOWN]
  F --> G[No decrease in a category, because no category is assigned]
```

## Failure: nurse rejects a highlight

The nurse dismisses the highlight. It stays in the revision diff as dismissed, hidden on the handover, and is not re-added on approve. A later re-compose may propose it again; the UI marks "dismissed on previous revision" if the same quote returns. That memory is **should-build**. If cut, re-compose simply shows the new brief and the nurse dismisses again.

## Failure: approve with gaps still open

Allowed. The handover lists them under "Still to clarify" and does not show a warning modal. Optional one-line note: "You can approve with these still open."

## Failure: auth

```mermaid
flowchart TD
  A[Request without session] --> B[Redirect to sign-in]
  B --> C[Seeded clinician signs in]
  C --> D[Return to encounter list]
  E[Action with another user's encounter id] --> F[Not found. Do not reveal the row]
```

Match the starter: do not leak existence across users.

## Failure: nurse tries to treat AI text as the chart

Copy and empty states repeat that the brief is a draft until approval, and that approval means "I have reviewed this record", not "the model is right". The approve button label is "Approve reviewed brief", not "Accept AI recommendation".

## State machine

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> composed: compose succeeds
  composed --> composed: edit or re-compose
  composed --> approved: approve
  approved --> composed: amend if built
  draft --> draft: save transcript
```

ATS recording does not change status. It is a side field the nurse owns.
