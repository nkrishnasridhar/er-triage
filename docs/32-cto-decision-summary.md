# 32 — CTO decision summary

Opinionated record. One decision per controversy. If a later chat proposes five options, this file already chose. Change it only by editing the decision and the ADR, not by quietly coding the alternative.

Event baseline: Saturday 26 September 2026, plan starts 12:00 NZST. Deadline: Sunday 27 September 2026 10:00 NZDT, after clocks jump forward at 02:00 NZST. Rules: [SaaSathon docs](https://www.saasathon.dev/docs).

## A. Product

Build **Front Brief**, a triage evidence brief for the triage nurse. The repo stays `er-triage`. The pitched name is Front Brief because CAREPOI sells ERTRIAGE, a device that claims to classify acuity.

The product converts a pasted conversation into a reviewable brief with provenance and gaps. The clinician decides. The model extracts and asks. TypeScript assembles.

`PRODUCT_GOAL.md` is the starter's looser goal. It allows "suggested areas for clinical attention" and a clinician decision about priority and next steps. This file tightens that: no suggested acuity, no disposition, no ranking. Follow this file.

## B. Maturity lines

| Line | Decision |
| --- | --- |
| SaaSathon MVP | Synthetic only. One seeded clinician. Paste. Provenance review. Approve. Hosted by 10:00 NZDT Sunday |
| Post-hackathon prototype | Still no real patients. Interviews. Optional audio spike off the main path |
| Clinical pilot | Not started. Gates in [24-pilot-plan.md](24-pilot-plan.md) are mandatory and unmet |
| Production healthcare product | Not claimed. One app remains the architecture until a measured limit forces a split |

Do not use pilot language on Sunday.

## C. The twelve contradictions

1. **ATS dropdown.** The field starts empty. The model has no writer. Copy: "You are recording your category. Front Brief does not assign or recommend one." Do not narrate a fictional category as correct.
2. **Items warranting attention.** They are template pointers to uncertain, negated, or contradicted quotes. No score, rank, or colour scale. Title: "Warranting another look".
3. **Gap detection.** Show at most three. Title: "Information to clarify". Never block approve.
4. **Audio.** Typed or pasted transcript is the demo. Live mic is cut first.
5. **Scribe-shaped demo.** Forbidden. The demo must show a hedge, a negation or contradiction, a gap, a quote, and an empty category.
6. **FHIR, NHI, SNOMED.** Future mappings only. MVP columns are plain. No FHIR library.
7. **Confidence.** No numeric model confidence in the schema, the UI, or the audit meta. It will be read as clinical certainty.
8. **Auth.** One seeded clinician. RBAC is post-hackathon. Hide signup on the demo path.
9. **Equity.** Language, accent, disability, literacy, or inability to speak is never evidence of lower urgency. There is no urgency output to attach that bias to. Manual typing is the path when speech fails. A copy line is not a completed equity review.
10. **Highlights.** Questions or pointers to source text. Never new clinical assertions. Assembler templates, not a free-form third model call.
11. **Buyer and user.** Buyer: health system. User: triage nurse. UI for the nurse. Pitch names the buyer.
12. **Clock.** It is already Saturday in New Zealand. The hour-by-hour plan starts at midday Saturday, includes dinner and sleep, and counts the lost daylight-saving hour. Elapsed time to the deadline is 21 hours.

## D. Architecture

One Next.js app on Vercel, Supabase Postgres and auth, model calls from server actions only. Two model calls (extract, gaps) plus `assemble.ts`. No Railway worker, no microservices, no client-side model key. Details: [07-system-architecture-mvp.md](07-system-architecture-mvp.md), ADR-003, ADR-005.

Production stays a modular monolith until integration or residency forces a split. [08-system-architecture-production.md](08-system-architecture-production.md).

## E. Data, schema, API

Tables: `encounters`, `transcripts`, `briefs`, `brief_revisions`, `audit_events`. `synthetic` must be true. Statements live in the JSON payload. Version `1.0.0-mvp` freezes Saturday 16:00 NZST.

Epistemic status: `EXPLICIT | UNCERTAIN | NEGATED | CONTRADICTED | UNKNOWN`.

"I think I'm allergic to penicillin but I'm not sure" stays `UNCERTAIN`. "I don't have chest pain" stays `NEGATED`. "Any chest pain?" is not a finding.

API is server actions, not a public REST surface. `recordAts` is the only category writer. Compose never accepts a client-built brief.

## F. AI and provenance

Transcripts are untrusted, including spoken jailbreaks. System prompt is a constant. Sentinel-wrapped user data. Quotes must be exact slices. Repair once, then fail closed with the conversation saved.

The seven visibilities (reported, observed, context, highlighted, unanswered, warranting a look, clinician edits and approval) are the product. A chain-of-thought dump is not.

## G. Safety, security, privacy, standards

[14-safety-case.md](14-safety-case.md) is an engineering FMEA, not a validated clinical safety case.

[15-security-threat-model.md](15-security-threat-model.md) treats prompt injection from speech as a first-class threat. Defence is schema, assembler, and the absence of a tool that sets acuity.

[16-privacy-governance-regulatory.md](16-privacy-governance-regulatory.md) does not give legal advice. Privacy Act 2020 and the Health Information Privacy Code 2020 are known instruments. How they apply here, and any medical-device classification, **requires specialist confirmation**. Do not say "not a medical device" as a fact. Do not promise on-shore processing.

[17-interoperability.md](17-interoperability.md): FHIR-first is Health NZ's published direction for exchange. We are not exchanging. No NHI in the demo.

## H. Demo and pitch

Win condition: on the hosted URL, Mara's penicillin line stays uncertain, a denial stays negated, at most three clarifications do not block, a highlight shows its quote, and ATS stays empty until a human sets it.

Script: [28-demo-script.md](28-demo-script.md). Five minutes. If the allergy renders as a confirmed chip, say it failed. Do not talk through it.

Judging alignment: SaaSathon wants one useful AI workflow, not a chatbot and not another meeting recorder. Their challenge text also says AI may "make better decisions". We resolve that by letting the model decide only how to label and quote speech, never the clinical decision. The tighter safety scope wins. Recorded so the team does not "add a recommendation" to match a sentence on the event site.

Starter templates are explicitly allowed. "Start from scratch" does not forbid this starter. Building the encounter workflow during the weekend is the requirement. This documentation pass is not the submitted product by itself.

## I. Execution

[26-hackathon-execution-plan.md](26-hackathon-execution-plan.md) is binding.

- Saturday 16:00 NZST schema freeze.
- Saturday 21:00 NZST Mara works locally.
- Saturday 23:30 NZST lights out. Wake 06:30 NZDT (about six hours, given the clock change at 02:00).
- Sunday 07:30 NZDT hosted path works.
- Sunday 09:00 NZDT feature freeze.
- Sunday 10:00 NZDT deadline.

Cut order: mic, streaming, amend, extra polish, then editor if and only if compose-and-approve with an empty ATS still ships. Never cut the empty ATS or the epistemic fixtures to save time.

## J. Unverified facts, specialist gates, win condition

### Not verified, do not put on a slide as fact

- About 1.47 million New Zealand ED presentations in 2025.
- About 5.3% year-on-year increase.
- About 5.7% left before being seen.
- About 1,250 NZ ED doctors or frontline staff in the scribe rollout. Heidi's post says 1,000 clinician licences and 100 mental-health crisis licences. Vendor-reported.
- Heidi pilot minutes (about 17 to just over 4, extra patient, up to 81% after-shift admin). Vendor-reported.
- KATE, TriageGO, and ERTRIAGE performance percentages.
- Any competitor price.
- Epic's current emergency AI feature list.
- Mediktor's detailed feature checklist beyond patient-facing navigation.
- Whether CareFlow shows negation as a first-class field.
- A primary-source extract of the AIHW 2024–25 table. Secondary reports say 9.1 million presentations. The 293 figure is AIHW 2023–24 purpose-built 24-hour public EDs, not a confirmed 2024–25 census.

### Verified enough to use carefully

- Six-hour target is 95%. Q4 2024/25 result reported as 73.9%. A DPMC factsheet reports 68.9% for the quarter ending September 2025. Do not merge those quarters.
- Ministerial comment, via news: average ED attendance about 3,150 a day in 2021 and 3,700 a day in 2025. Not an official annual total.
- ACEM: ATS in Australia and Aotearoa New Zealand; assessment generally no more than two to five minutes; not a diagnosis; maximum waiting times by category are published. Not a measurement of NZ staffing.
- Health NZ pages on NAIAEAG, the AI pre-implementation framework, FHIR-first, NZ Base, NZCDI, SNOMED CT, NHI as a named identifier.
- OPC pages on the Health Information Privacy Code 2020.
- SaaSathon: team size 4–8, hosted build, AI feature, 5+3 minute demo, Sunday 10:00 deadline, daylight saving warning, Vercel/Supabase/Railway suggestion, no private customer data.

### Specialist confirmation still required

HIPC application, overseas processing, retention, Māori data governance, clinician accountability arrangements, medical-device or intended-purpose classification, and any FHIR profile for ATS.

### Win condition

A judge on the hosted app can load the fictional Mara Ellison conversation and see an uncertain allergy stay uncertain, a denied or contradicted symptom stay unresolved, source quotes on the highlights, non-blocking clarifications, and a triage category that only changes when the clinician records it.

## ADR index

[ADR-001](ADRs/ADR-001-provenance-not-scribe.md) through [ADR-008](ADRs/ADR-008-synthetic-only.md).
