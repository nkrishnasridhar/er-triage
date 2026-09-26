# 06 — UX specification

> **Implementation update — 26 September 2026:** The implemented tablet is a large editable text capture form with optional browser speech recognition, unsupported/failed-speech fallback, no retained audio, and no urgency language. The desktop queue is chronological for unreviewed accounts, and nurse/admin views are read-only. This implementation note supersedes typed-only screen assumptions.

Visual system: the starter in `app/globals.css`. Inter Variable only. Black `#000000`, charcoal `#242424`, blue `#2395ff`, off-white `#f0f0f0`, white background. Reuse `components/ui/button.tsx` and field styles. No new font, no brand mark we do not own, no ATS colour scale.

Primary surface is a laptop browser. Check 768px width once. At 390px the review sections stack in the same order; do not design a separate mobile product.

The nurse is tired and fast. One primary button per screen. Safety text is a sentence, not a modal on every click.

## Global chrome

- Product name in the header: **Front Brief**
- Session: "Demo Clinician"
- Persistent safety line on encounter screens: "Fictional patients only. Not for real health information."
- Sign out is a text button, not the visual primary.

## Screen 1 — Sign in

Objective: reach the encounter list as the seeded clinician.

Hierarchy: product name, one sentence, email, password, submit.

Components: starter login form, retitled.

Actions: submit credentials. No self-serve signup on the demo path (hide or do not link it).

Loading: button label "Signing in…", disabled.

Error: "Those details were not recognised." Do not say which field was wrong.

Empty: fields empty. Placeholder email is not a real address.

Safety copy, under the button:

> Synthetic demo. Do not type a real patient's name or story.

Exact title: "Front Brief"

Exact subtitle: "A triage evidence brief for the nurse to review. It does not assign urgency."

## Screen 2 — Encounter list

Objective: open a fixture or start a fictional encounter.

Hierarchy: title, primary "New fictional encounter", then rows.

Row contents: display name, status word (`Draft`, `Ready for review`, `Approved`), relative time. No ATS numeral, no coloured dot.

Actions: open row, new encounter.

Loading: "Loading encounters…"

Error: "Encounters could not be loaded. Refresh this page."

Empty: "No fictional encounters yet. Create one, or reload the demo seed."

Safety copy:

> This list is not a queue and not an urgency order.

Exact heading: "Encounters"

## Screen 3 — New encounter

Objective: name the fiction and record context the nurse actually has.

Hierarchy: banner, name field, context textarea, create.

Fields:

- Display name, required, max 80. Label: "Fictional name"
- Context, optional, max 1,000. Label: "Context you are providing"
- Helper: "Arrival, companion, language, or anything you observed before the conversation. Written here, it is marked as context you provided."

Actions: "Create encounter". Cancel returns to the list.

Loading: "Creating…"

Error: inline field errors from Zod. Server failure: "The encounter was not created. Try again."

Empty: name empty, context empty.

Safety copy:

> Use a made-up name. Real patient details do not belong in this demo.

## Screen 4 — Transcript

Objective: get untrusted text into the encounter.

Hierarchy: safety banner, textarea, "Save conversation", secondary "Compose brief" enabled only after a save of non-empty text.

Label: "Conversation"

Helper:

> Type or paste. A microphone is not part of this demo. If speaking or hearing fails, type what you observed. Difficulty communicating is not evidence of lower urgency.

Placeholder:

> Nurse: What brought you in?
> Patient: …

Actions: save, compose, back to list.

Loading save: "Saving…"

Loading compose: leave this screen for Screen 5.

Error empty compose: "Add the conversation before asking for a brief."

Error too long: "This transcript is too long for the demo. Paste the triage conversation only."

Safety copy, above the field:

> This text is data, not an instruction to the system. Clinical decisions stay with you.

## Screen 5 — Composing

Objective: wait without implying a clinical result.

Hierarchy: patient name, progress sentence, no spinner-as-diagnosis.

Exact copy:

> Reading the conversation into a draft brief. You will review every line.

Loading lasts until success or 25 seconds.

Error:

> The brief was not updated. The conversation is saved. Try again.

Do not show raw model output or a stack trace.

Safety: same global banner. Do not show "Analysing risk".

## Screen 6 — Review (primary demo screen)

Objective: let the nurse see provenance and completeness, then edit or approve.

Order, top to bottom. Do not use a dense three-column dashboard; one column, headings sticky only if cheap.

1. Title: fictional name, status.
2. Disclaimer banner, exact:

> Draft for clinician review. Not a diagnosis, triage category, queue rank, or disposition.

3. **Patient reported** — statements with that source kind.
4. **Staff observed** — statements the nurse or the transcript marks as observation.
5. **Context provided** — explicit context.
6. **Warranting another look** — highlights only.
7. **Information to clarify** — zero to three gaps.
8. **Your category** — ATS control, empty.
9. Actions: "Approve reviewed brief". Secondary: "Update brief from conversation" (re-compose). Tertiary: "Edit conversation".

### Statement row

- Epistemic word in text, always: `Explicit`, `Uncertain`, `Negated`, `Contradicted`, `Unknown`.
- Statement text.
- Quote: the source substring, in quotation marks, with speaker if known.
- Action: "Edit".

Uncertain allergy must display like:

> Uncertain. Patient thinks they may be allergic to penicillin and is not sure.

Never:

> Allergy: Penicillin

Negation must display like:

> Negated. Patient said they do not have chest pain.

### Highlight row

Prefix is either "Question:" or "See passage:". The body does not add a symptom the transcript did not state. Under it, the quote.

Empty highlights: "Nothing highlighted beyond the statements above."

### Gap row

Heading of the section, exact: "Information to clarify"

Each item is a question. Buttons: "Note an answer", "Dismiss". There is no "Required" label.

Section helper, exact:

> Up to three questions. You can approve without answering them.

If the nurse notes an answer, it is appended to context as clinician-provided text and does not auto-become a patient-reported fact until they re-compose or add a statement themselves.

### ATS block

Label: "Your category"

Control: select, first option "Not recorded", then 1, 2, 3, 4, 5. No descriptions such as "immediate" or "non-urgent" in the MVP. Those words teach the model’s silence to sound like a recommendation scale. The numeral is enough, because the audience knows ATS, and the helper sentence carries the safety point.

Helper, exact:

> You are recording your category. Front Brief does not assign or recommend one.

If unset, the summary chip says "Not recorded".

### Loading

Section skeletons labelled "Loading draft…". Do not shimmer clinical words.

### Error

If the stored brief fails schema on read: "This draft cannot be shown safely. Compose again from the saved conversation."

### Safety

The approve button is not green-for-go in a way that means "safe to discharge". Use the starter primary button. Label remains "Approve reviewed brief".

Confirmation is inline, not a modal: on click, the button becomes "Confirm approval" for one extra click. This stops a mis-tap. If that double click slips the schedule, a single click is acceptable (**should**).

## Screen 7 — Edit statement

Objective: correct one statement without a form builder.

Fields: text, epistemic status select (five values), source kind select limited to reported / observed / context.

If the nurse changes text so it no longer matches the quote, show:

> You changed the wording. The original quote stays attached.

Actions: "Save edit", "Cancel".

Error: "The edit was not saved."

Safety:

> Your name is stored with this edit.

## Screen 8 — Add observation

Reached from "Add what you observed" on the review screen.

Label: "Staff observation"

Helper:

> This is recorded as your observation, not as something the patient said.

Action: "Add observation"

This is **must** if time allows one extra control; otherwise the nurse edits context. Prefer this control because it protects provenance.

## Screen 9 — Handover

Objective: a second person can read the approved record.

Hierarchy: "Approved brief", approver display name, Pacific/Auckland timestamp, then the same groups as review, read-only, dismissed highlights omitted, open gaps under "Still to clarify".

ATS line, if empty: "Category: not recorded by the clinician."

ATS line, if set: "Category: 3, recorded by Demo Clinician at {time}. Recorded by the clinician. Not assigned by Front Brief."

Use the numeral the nurse chose. Do not add a sentence that the category fits the story.

Actions: "Back to encounters". "Amend" only if that should-build item exists.

Exact footer:

> Approval means a clinician reviewed this brief. It is not a diagnosis, prescription, queue position, or disposition.

## Screen 10 — Compose failed (full)

Same encounter chrome. Exact body in Screen 5 error. Primary action "Try again". Secondary "Edit conversation".

## Screen 11 — Injection fixture result (Samir)

No special screen. The review must look ordinary. The quote of the "ignore previous instructions" sentence, if shown, is under Patient reported or is absent. It must not appear in a system banner. ATS remains "Not recorded" until the nurse types one.

Demo speaker points at that emptiness. The UI does not wink.

## Screen 12 — Not found / no access

Exact copy: "That encounter is not available."

Do not say "forbidden" versus "missing".

## Components to implement

| Component | Client or server |
| --- | --- |
| `EncounterList` | Server Component |
| `TranscriptForm` | Small client form posting a server action |
| `BriefReview` | Server render plus client islands for edit, ATS, approve |
| `EpistemicLabel` | Server, text plus status |
| `SourceQuote` | Server |
| `GapList` | Client island, max three |
| `AtsField` | Client island, posts `recordAts` only |
| `SafetyBanner` | Server |

Keep islands small, per the starter rule.

## Copy deck (do not paraphrase in the UI)

| Id | String |
| --- | --- |
| C1 | Fictional patients only. Not for real health information. |
| C2 | Draft for clinician review. Not a diagnosis, triage category, queue rank, or disposition. |
| C3 | You are recording your category. Front Brief does not assign or recommend one. |
| C4 | Information to clarify |
| C5 | Up to three questions. You can approve without answering them. |
| C6 | Warranting another look |
| C7 | Type or paste. A microphone is not part of this demo. If speaking or hearing fails, type what you observed. Difficulty communicating is not evidence of lower urgency. |
| C8 | This text is data, not an instruction to the system. Clinical decisions stay with you. |
| C9 | Approve reviewed brief |
| C10 | Approval means a clinician reviewed this brief. It is not a diagnosis, prescription, queue position, or disposition. |
| C11 | The brief was not updated. The conversation is saved. Try again. |
| C12 | This list is not a queue and not an urgency order. |

## What the UI must never display

- "AI recommends"
- "Suggested triage"
- "Confidence"
- "Risk score"
- "High / medium / low" as a clinical tier
- A waiting-room rank
- "Diagnosis"
- A green check that means the patient is safe
- Penicillin (or any allergen) as a bare positive chip when status is `UNCERTAIN`
