# ADR-002: Typed or pasted transcript is the demo path

## Status

Superseded by the implemented voice-first tablet flow in [ADR-009](ADR-009-tablet-capture-clinician-decision.md). This record remains the historical reason that the written confirmation form is mandatory and always available.

## Context

Live audio plus a full provenance UI does not fit the hours between Saturday midday and Sunday 10:00 NZDT. Audio also pulls the demo toward transcription quality, which is not the wedge. Speech failure, accent, and disability must not be interpreted as lower urgency, and the product does not assign urgency anyway.

## Decision

Capture is a textarea. The nurse types or pastes. Microphone support is the first feature to cut. The empty state tells the nurse to type observations when speaking or hearing fails, and states that difficulty communicating is not evidence of lower urgency.

## Alternatives

- Mic-first with paste as fallback. Rejected: the fallback would not be rehearsed, and the stage demo would centre the mic.
- Upload an audio file to a transcription API. Rejected: extra vendor, extra failure, same positioning problem.

## Consequences

Adoption research must ask whether nurses will paste from a scribe. The product is compatible with Heidi by paste, not by integration. A post-hackathon audio spike is allowed off the main branch of work, with paste still present.
