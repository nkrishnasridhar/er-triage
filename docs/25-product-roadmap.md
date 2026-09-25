# 25 — Product roadmap

Phases are dependency order, not a calendar. The only date is the hackathon deadline.

## Phase 0 — Specification

This documentation set. Exit: a team can implement without inventing scope. Status: the docs PR.

## Phase 1 — SaaSathon MVP

Must-build list in [04-mvp-scope.md](04-mvp-scope.md). Exit: hosted happy path plus Samir, Sunday 27 September 2026 10:00 NZDT. Synthetic only. One clinician. Typed transcript. No FHIR. No acuity from the model.

## Phase 2 — Post-hackathon prototype

Still no real patients.

- Fix what the demo embarrassed.
- Amend-after-approval if it was cut.
- Run E1 from the business model with five nurses.
- Optional audio spike in a branch, typed path remains default.
- Two-account RLS test kept green.

Exit: a decision to stop or to seek a simulation inside a training environment. Stopping is a successful outcome.

## Phase 3 — Governed simulation

Acted patients inside a health-system training setting, only after a privacy conversation says the setting is appropriate. Still not the live ED. Start G2–G6. No NHI. No model training on the transcripts.

Exit: a written intended purpose and a go or no-go for a pilot proposal.

## Phase 4 — Clinical pilot

[24-pilot-plan.md](24-pilot-plan.md). One department. Real patients only with all gates passed. Paste interoperability only.

Exit: stop, or a procurement conversation that the buyer starts.

## Phase 5 — Production candidate

SSO, retention, region choice, support hours, export to text or PDF, audit review. FHIR only if the buyer’s integration team asks and pays the mapping effort. Normalised statement tables only if reporting needs them.

Exit: a contract the team can actually support. If the team is four students, this phase may mean partnering rather than operating a clinical vendor. That is an honest constraint, not a slogan.

## Phase 6 — Adjacent jobs, only if phase 4 worked

- Re-triage documentation when the nurse reassesses someone who is still waiting (ACEM describes re-triage; we do not build it early).
- Handover to the treating clinician as a pushed artefact.
- Interpreter-mediated encounters with the same epistemic rules.

Still out: ambulance triage, patient self-triage, waiting-room ranking, automatic ATS, prescribing, diagnosis, replacing the EHR.

## Kill criteria

- E1 fails.
- A specialist says the UI is decision support no matter the disclaimer, and the team is unwilling to change the UI.
- The only buyer demand is "give us a category". That is a different product. Decline it.
