# ADR-001: Provenance brief, not a scribe or a triage assigner

## Status

Accepted for the SaaSathon MVP.

## Context

New Zealand emergency departments are being offered Heidi as an ambient scribe. Other products (KATE, TriageGO, ERTRIAGE) recommend an acuity level. SaaSathon marks generic meeting recorders as a weak fit. The starter's `PRODUCT_GOAL.md` uses the name ER Triage, which collides with CAREPOI's ERTRIAGE. The brief requires the clinician to remain the decision-maker and forbids diagnosis, prescribing, ATS assignment, ranking, and disposition.

## Decision

The product is ERgency. It produces a triage evidence brief whose value is provenance and completeness. It does not draft "the note" as the primary artefact, and it does not assign or recommend an ATS category. The repo name `er-triage` stays to avoid a rename during the weekend.

## Alternatives

- Build a better scribe. Rejected: incumbent and weak judging fit.
- Build acuity decision support. Rejected: forbidden by the safety brief and a different clinical claim.
- Keep the public name ER Triage. Rejected: trademark and positioning collision with ERTRIAGE.

## Consequences

The demo script must show hedges, gaps, and an empty category. Marketing copy that says "AI triage" is a bug. A later buyer who only wants a category will be turned away.
