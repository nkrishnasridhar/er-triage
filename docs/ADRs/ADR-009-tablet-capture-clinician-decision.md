# ADR-009: Anonymous tablet capture; clinician-only decision

## Status

Accepted and implemented.

## Decision

Use a public, anonymous tablet solely to submit a confirmed text account. The primary input is a short live Realtime voice conversation in which the assistant asks neutral questions aloud; a separate form is the required editable confirmation step and the fully typed alternative. The app does not retain audio, although the Realtime provider processes audio during the live session. Put every read, edit, decision, and approval behind an authenticated staff role; only the `clinician` role may approve.

The brief model may organise captured wording and ask neutral clarification questions. It may not set, suggest, rank, prefill, or otherwise imply clinician priority, next step, triage category, diagnosis, treatment, or disposition. A separate review-suggestion model may return only source quotes for the application to turn into the initial display order; awaiting reports remain individually openable.

## Consequences

The tablet is useful without exposing clinical records. It also means the first verified demo account needs an audited clinician bootstrap and later roles need provisioning. The review suggestion is stored separately, is immutable after assessment, and can never update a clinical decision field. It remains a fictional-data hackathon demonstration pending governance, evaluation, and regulatory work.
