# ADR-009: Anonymous tablet capture; clinician-only decision

## Status

Accepted and implemented.

## Decision

Use a public, anonymous tablet solely to submit a confirmed text account. Browser speech recognition may help enter that text but audio is not retained. Put every read, edit, decision, and approval behind an authenticated staff role; only the `clinician` role may approve.

The model may organise captured wording and ask neutral clarification questions. It may not set, suggest, rank, prefill, or otherwise imply priority, next step, triage category, severity, risk, or waiting-room order. Awaiting reports remain chronological.

## Consequences

The tablet is useful without exposing clinical records. It also means the first verified demo account needs an audited clinician bootstrap and later roles need provisioning. This deliberately rejects a more visually dramatic AI queue reorder: such a feature would make the system a triage decision-maker and would require new clinical governance, evaluation, and regulatory work.
