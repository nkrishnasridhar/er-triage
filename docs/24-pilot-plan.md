# 24 — Pilot plan

A clinical pilot is phase 4 in [25-product-roadmap.md](25-product-roadmap.md). It is not this weekend. No real patient is in scope until the gates below are actually passed. This document does not pass them.

## Principle

Simulated patients and tabletop reviews come first. Real health information comes last, in one department, with a clinical owner who is not the vendor, and with a written decision that the tool's intended purpose matches what was assessed.

## Gates before any real patient

| Gate | Evidence required | Status now |
| --- | --- | --- |
| G0 Synthetic product works | Hosted demo, fixture checklist | Not built yet. Specified |
| G1 Problem validation | Notes from [23-validation-plan.md](23-validation-plan.md) showing a real wedge against EHR + scribe | Not done |
| G2 Local clinical owner | Named nurse lead and medical lead who accept accountability for use | Not done |
| G3 Privacy | Written view from the agency's privacy function on HIPC, notice, retention, and overseas processing | Not done. See [16-privacy-governance-regulatory.md](16-privacy-governance-regulatory.md) |
| G4 Security | Agency review of the threat model against their standard, not this chapter alone | Not done |
| G5 AI governance | Submission through the path NAIAEAG / the pre-implementation framework expects, if the agency is Health NZ | Not done. Heidi's endorsement does not transfer |
| G6 Intended purpose | Specialist view on device / decision-support classification given the actual UI | Not done. Do not self-classify |
| G7 Safety case | A real one, replacing [14-safety-case.md](14-safety-case.md), with clinical sign-off | Not done |
| G8 Equity | Review of language, disability, and interpreter pathways with people who can speak to them. Manual entry remains available | Not done |
| G9 Data | No training on pilot transcripts unless a separate approval says so | Default: no training |
| G10 Exit | A date when the pilot stops, and a way to go back to current documentation the same shift | Not done |

If a gate is "we think it's fine", it is not passed.

## Suggested shape, after the gates

- One ED, one shift pattern, volunteers among triage nurses.
- Acted scenarios with a simulated patient actor before any real patient.
- Success is qualitative: nurses can explain provenance, and they do not treat highlights as acuity. Time saved is optional and secondary.
- Stop conditions: any use of the brief as an ATS recommendation, any real patient entered before G3–G7, any attempt to rank the waiting room.
- Duration and sample size are not specified. Picking "100 patients" now would be theatre.

## What the pilot must not measure as success

- Agreement of the model with ATS. That metric pulls the product into assigning categories.
- Reduction in the national six-hour target. The tool cannot own that outcome.
- "Zero hallucinations" without the separate checks in [18-testing-strategy.md](18-testing-strategy.md).

## Training

Nurses need fifteen minutes on three things: hedges stay hedges, the category control is theirs, and paste from the scribe is allowed. A long training programme is a sign the UI failed.

## Relationship to Heidi

The pilot assumption is that Heidi or another scribe may already be in the room. ERgency must accept pasted text. A pilot that requires removing the scribe will not be approved and should not be proposed.
