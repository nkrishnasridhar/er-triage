# ADR-008: Synthetic data only this weekend

## Status

Accepted. Binding until the pilot gates are passed. Those gates are not passed.

## Context

SaaSathon forbids private customer data. The product brief forbids real patient health information and forbids diagnosing synthetic patients. The Privacy Act 2020 and the Health Information Privacy Code 2020 are relevant to any later real use and have not been applied to this product by a specialist. A `synthetic` flag that someone can toggle off in the UI would be ignored under demo pressure.

## Decision

Seed encounters are fiction (Mara Ellison, Jules Pene, Samir Holt). The database constraint is `synthetic = true` with a check that it stays true. There is no UI to turn it off. Banners say fictional patients only. The team does not paste war stories from real shifts into the app. The model is not asked to name a diagnosis or a correct ATS category for these personas.

## Alternatives

- "De-identified" real cases. Rejected: we cannot verify de-identification this weekend, and the event rules do not allow private customer data.
- A toggle for future pilot mode in the same database. Rejected: the pilot needs a different environment and a governance record, not a boolean.

## Consequences

The demo disclaimer is part of the schema, not just the CSS. Any implementation that makes `synthetic` updatable is a defect. Training a model on later real transcripts is a separate decision and defaults to no.
