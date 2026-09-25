# ADR-004: Plain internal fields; standards later

## Status

Accepted for the SaaSathon MVP.

## Context

Health NZ publishes a FHIR-first policy, NZ Base, NZCDI, SNOMED CT, and the NHI identifier system. Implementing them over a weekend on fictional patients would imply a real identity model and a conformance claim we cannot make. Uncertain clinical statements map badly onto AllergyIntolerance and Condition resources.

## Decision

The MVP stores display name, context note, transcript text, and the versioned brief JSON. No NHI column, no SNOMED codes, no FHIR client. `17-interoperability.md` holds future mappings so negation and uncertainty are not later forced into positive coded facts.

## Alternatives

- Emit a FHIR Bundle for the demo. Rejected: cosplay, and a wrong AllergyIntolerance is a safety bug.
- Store a fake NHI. Rejected: realistic identifiers are a hazard.

## Consequences

"Interoperable" must not appear on the slide as a capability. Paste and a human reading the handover are the integration. A buyer who requires FHIR before any conversation is a later project, not a Sunday task.
