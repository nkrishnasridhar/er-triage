# ADR-006: No numeric model confidence

## Status

Accepted for the SaaSathon MVP and kept until a safety case explicitly allows a number.

## Context

A field such as `confidence: 0.82` will be read as clinical certainty. Highlights can already be misread as a risk score. The schema, the database check, the prompts, and the logs all need the same ban or the number will leak back through one of them.

## Decision

Do not store, display, or log a probability, confidence, risk score, or rank. Reject model JSON that contains those keys. Audit meta may carry counts of statements and a boolean `atsSet`, not a score and not a clinical justification.

## Alternatives

- Show confidence only to engineers. Rejected: it will be screenshotted.
- Calibrated probabilities after a study. Not this product's roadmap unless the intended purpose changes, which we are not seeking.

## Consequences

The team cannot sort patients by model certainty. That is the point. Evaluation uses separate pass/fail checks in `18-testing-strategy.md`, never one accuracy percentage.
