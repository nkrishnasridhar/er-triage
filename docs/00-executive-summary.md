# 00 — Executive summary

## Recommendation

Build **Front Brief**: a voice-first tablet conversation with an always-available written alternative that converts a person-confirmed emergency-department account into a clinician-reviewable triage evidence brief. Ship that workflow hosted, on synthetic patients, before Sunday 27 September 2026 10:00 NZDT.

The innovation to show is provenance and completeness. Transcription quality is a weak demo. Heidi and other ambient scribes already draft notes. Front Brief's job is the two-to-five-minute window before the triage nurse decides, and the record of what was known, missing, and changed.

## What the nurse can see

On one review screen:

- what the patient reported
- what staff observed
- what context was explicitly provided
- what the AI only highlighted
- what is unanswered
- which source lines warrant another look
- where each fact came from
- what the clinician changed or approved

## What the product will not do

In every maturity stage below production, and in production unless a later safety case says otherwise:

- diagnose
- prescribe
- assign an Australasian Triage Scale (ATS) category
- rank patients or decide who is seen first
- determine disposition
- replace a nurse or doctor
- present model output as clinical truth

A demo ATS control may exist. It starts empty. Only the signed-in clinician can set it. Copy on the control says the clinician is recording their own category. The model has no field to write.

## Four lines that stay separate

| Line | Who is in the system | Data | Decision rights | This weekend |
| --- | --- | --- | --- | --- |
| SaaSathon MVP | One seeded demo clinician | Fictional patients only | Clinician approves a brief. No ATS from the model | Build this |
| Post-hackathon prototype | Invited testers, still not a hospital | Synthetic, or acted scenarios with consent | Same clinical boundary | Do not build |
| Clinical pilot | Named ED, governed access | Real patients only after the gates in [24-pilot-plan.md](24-pilot-plan.md) | Clinician remains accountable | Do not start |
| Production healthcare product | Health-system tenant | Governed health information | Contract, safety case, support, audit | Do not claim |

`PRODUCT_GOAL.md` at the repo root is the starter's earlier goal statement. It is looser: it talks about suggested attention areas and the clinician deciding priority and next steps. This package tightens that. Where they differ, follow [32-cto-decision-summary.md](32-cto-decision-summary.md).

## Why this can win the weekend

SaaSathon asks for one useful workflow, hosted, with AI doing real work, demoed live in five minutes. Judging is innovation, execution, impact, and presentation ([event docs](https://www.saasathon.dev/docs)). A generic chatbot and "another AI meeting recorder" are listed as weak fits.

Front Brief fits the strong pattern: messy conversation in, a finished reviewable record out, with a reason to open it on the next patient. The AI step is extraction, negation handling, and gap detection. Assembly of the brief is deterministic code so the model cannot silently add a fact while "summarising".

## User and buyer

The user is the triage nurse. The screen is for that nurse, on a laptop or tablet, in Inter, using the starter colour tokens.

The buyer hypothesis is a health system (in New Zealand, Health New Zealand | Te Whatu Ora; in Australia, a state public-hospital operator). The pitch names the buyer. The demo does not pretend a nurse has a procurement budget. See [22-business-model.md](22-business-model.md). This is a hypothesis.

## Wedge

Against Heidi, already being rolled out to New Zealand emergency departments as an ambient scribe, and against other scribes:

| They do | Front Brief does |
| --- | --- |
| Draft the note from ambient audio | Orchestrate triage information before the decision |
| Optimise documentation time | Show gaps, provenance, and reported versus observed versus highlighted |
| Sit beside or inside the record | Stay compatible with the EHR and the scribe. It does not replace either |

The model is not the moat. The moat to test is the review workflow: capped clarifications, source-linked highlights, an audit of clinician edits, and a handover a colleague can scan. That claim is unvalidated until the interviews in [23-validation-plan.md](23-validation-plan.md).

## Scope in one list

Must build: seeded sign-in, three synthetic encounters, paste transcript, compose, review with the eight visibilities above, edit, non-blocking clarifications (show at most three), empty ATS control, approve, handover view, one prompt-injection fixture.

Cut first: live microphone, FHIR, NHI, SNOMED, role-based access, numeric confidence, patient ranking, diagnosis text, real patient data.

## Clock

The plan in [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md) starts Saturday 26 September 2026 12:00 NZST. It includes dinner, a sleep block, and the lost hour when New Zealand daylight saving starts at 02:00 NZST Sunday (clocks become 03:00 NZDT). Elapsed time from midday Saturday to 10:00 Sunday is 21 hours, not 22.

## Win condition

A judge can open the hosted app, sign in as the demo clinician, paste or load the Mara Ellison synthetic transcript, and watch uncertain penicillin language stay uncertain, a denied symptom stay negated, three clarifications appear without blocking approval, every highlight quote its source, and the ATS control remain empty until the clinician sets it.
