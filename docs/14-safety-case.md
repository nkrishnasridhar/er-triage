# 14 — Safety case

> **Implementation update — 26 September 2026:** The tablet adds no model-derived urgency signal. Its voice assistant asks neutral questions aloud, and only voluntarily confirmed text is recorded; speech success/failure is never clinical input. Database roles make nurse/admin review read-only and clinician decision/approval authority exclusive. These controls are implemented and covered by the local integration test.

This is an engineering exercise for a hackathon specification. It is not a validated clinical safety case, not a Health NZ endorsement, not an ISO 14971 file, and not clearance to use the product with patients. Nobody should attach this chapter to an ethics application as if it were one.

The hazard analysis uses an FMEA-style table because that is a familiar way to list failure modes. Severity, occurrence, and detection numbers are **not** calibrated. They are ordinal labels (`low`, `medium`, `high`) for engineering priority inside the demo. Do not multiply them into an RPN and do not quote them as risk estimates.

## Intended use (MVP)

A signed-in person reviews a structured brief of a **fictional** conversation before approving a record that stays inside the demo database.

## Intended use we refuse

Supporting real triage decisions, suggesting ATS categories, ranking a waiting room, diagnosing, prescribing, or replacing a clinician.

## Hazard log

| ID | Failure | Effect if this were real care | Demo control | Residual note |
| --- | --- | --- | --- | --- |
| H1 | Hedge dropped. Uncertain penicillin becomes "Allergy: Penicillin" | Wrong allergy in a later record | Prompt rule, fixture test, UI forbids bare chip | Live model can still regress. Sunday manual check on Mara |
| H2 | Negation flipped. "No chest pain" becomes chest pain | Wrong positive finding | Prompt rule, fixture, label "Negated" | Same |
| H3 | Staff question stored as a patient finding | Fabricated symptom | Prompt rule, Jules fixture | Same |
| H4 | Model writes ATS | Product appears to triage | Schema, assembler overwrite, `recordAts` is the only writer, UI helper C3 | A bug in `recordAts` could still save a value the nurse did not choose. Action must read the select, not the model |
| H5 | Highlights read as a risk score | Implicit acuity | Fixed templates, no numbers, no colour scale, title copy | A nurse can still over-read a pointer. Copy is the control, not a guarantee |
| H6 | Gaps block approval | Delay in a short assessment | Approve ignores gaps, max three, helper C5 | None in software. Process risk remains if the team adds a modal later. Do not |
| H7 | Injection in speech changes instructions | Category or diagnosis appears | Untrusted block, assembler, Samir fixture | Jailbreaks evolve. The fixture is one sentence, not a proof |
| H8 | Invented fact with no quote | Record contains fiction | Span substring check | Paraphrase in `text` can still overreach. Nurse review is the control |
| H9 | Equity proxy. Silence, accent, language, disability treated as lower urgency | Discriminatory queueing | No acuity output at all. Manual entry copy C7. No model feature uses speech fluency | Cannot be fully tested this weekend. The absence of a score is the control |
| H10 | Demo data treated as a real chart | Real PHI in a hackathon tool, or fictional brief copied into an EHR by mistake | Banner C1, `synthetic` check constraint, pitch says fictional | Human error. Say it on stage |
| H11 | Approved brief looks like a diagnosis | Over-trust | Disclaimer const in the schema, footer C10 | Copy fatigue |
| H12 | Compose timeout pushes the nurse to skip reading | Rubber-stamp | Failure leaves the transcript; no partial brief | Demo pressure. Presenter reads one quote aloud |
| H13 | Contradiction averaged away | Lost disagreement | Both statements kept, template highlight | Model may emit only one. Fixture for the assembler; live check for the model |
| H14 | Companion speech stored as patient speech | Wrong historian | `speaker` field. If unknown, label Unknown | Easy to get wrong. Do not claim companion detection works |
| H15 | Re-compose wipes the nurse's ATS | Lost decision | Assembler copies previous `clinicianAts` | Test this specifically |
| H16 | Logs leak the transcript | Privacy incident even on synthetic data, and a bad habit before any pilot | [19-observability.md](19-observability.md) | Depends on discipline during debugging. Ban `console.log(transcript)` in review |

## Controls we will actually build

Mapped to requirements: FR-005, FR-006, FR-007, FR-008, FR-010, FR-014, FR-016, NFR-005, NFR-007, NFR-010.

## Controls we will not pretend to have

- A clinical evaluation, reader study, or nurse time-and-motion study.
- Adversarial testing beyond the fixtures.
- Monitoring for deterioration.
- Human factors validation with exhausted night-shift staff.
- Fairness metrics across real demographic groups. We have no real patients and we will not invent those metrics.

## Use-error scenarios

| Scenario | Desired behaviour |
| --- | --- |
| Judge says "so what category is this?" | Presenter points at "Not recorded" and says the nurse would choose. Presenter does not fill a number and defend it |
| Teammate adds a red "urgent" badge to ship faster | Reject the change. It reopens H5 |
| Model returns a beautiful paragraph and broken JSON | Show the error. Do not paste the paragraph into the brief |

## Safety owner this weekend

The person wearing the product/safety role in [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md) can block a merge that writes ATS from compose or that removes the disclaimer. That is a team rule, not a clinical governance appointment.

## Post-hackathon

A real safety case would need a named clinical lead, hazard ownership, intended-purpose wording reviewed by someone competent in NZ device and privacy rules, and a decision that the intended purpose is documentation support rather than triage decision support. This chapter does not make that legal classification. See [16-privacy-governance-regulatory.md](16-privacy-governance-regulatory.md).
