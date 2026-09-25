# ADR-005: Split extraction and gaps; assemble in code

## Status

Accepted for the SaaSathon MVP.

## Context

One generative pass that "writes the brief" will drop hedges and merge contradictions. The transcript is untrusted data and may contain instructions. The approved document must match a strict schema, including an ATS object the model is not allowed to fill.

## Decision

Call the model twice: extraction, then gap questions. `lib/encounters/assemble.ts` builds the `TriageEvidenceBrief`, caps gaps at three, creates highlights from fixed templates, checks quotes, and sets the category from prior clinician input or null. Transcript text is sent only inside an untrusted sentinel block. One JSON repair call is allowed. Then fail closed.

## Alternatives

- Single call returning the full brief. Rejected: smoother and less faithful.
- Third call to write a narrative summary. Rejected: reintroduces invented facts. Cut first if someone adds it.
- Agent with tools. Rejected: the tempting tool is "set acuity".

## Consequences

Latency is two round trips. Tests can target the assembler without a network. Prompt changes cannot silently add schema fields if Zod stays strict. The system prompts in `12-ai-design.md` are the ones to paste into code.
