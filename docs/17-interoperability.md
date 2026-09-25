# 17 — Interoperability

## Recommendation

The MVP stores plain internal fields: display name, context note, transcript text, and the brief JSON. It does not call an NHI service, does not emit FHIR, and does not bind SNOMED codes. Mapping is documentation for a later phase so the team does not paint itself into proprietary dead-ends, and so nobody spends Saturday on a Patient resource.

ADR-004 records the decision.

## What public sources support

**KNOWN:** Health New Zealand's interoperability standards page states that the HL7 FHIR standard must be used in new health data exchange solutions such as APIs and messaging, that a FHIR-first policy applies to all new builds, and that NZ Base is New Zealand's national base implementation guide. The same page names SNOMED CT, the NZ Core Data for Interoperability (NZCDI), and identifier namespaces including NHI and HPI. Source: [Health NZ, interoperability standards](https://www.healthnz.govt.nz/health-professionals/guidance-standards/topic/data-and-standards/health-information-standards/approved-health-information-standards/interoperability-standards).

**KNOWN:** The NZ Base implementation guide describes shared NZ artefacts, including NHI as an identifier system, and recommends international terminologies such as SNOMED CT where possible. Source: [HL7 NZ Base IG](https://build.fhir.org/ig/HL7NZ/nzbase/).

**KNOWN:** HISO 10083:2020 is listed on that standards page as the interoperability roadmap. This package does not summarise the roadmap beyond the FHIR-first point above.

**REQUIRES SPECIALIST CONFIRMATION:** which profile a triage evidence brief would use, whether a nurse-recorded ATS belongs in a specific NZ extension, and whether a demo vendor may store an NHI at all. The MVP answer is that it must not store one.

## Future mapping, not a build

If a post-pilot export is ever justified, the internal field would map like this. These are planning labels, not conformance claims.

| Internal field | Future direction | Not now, because |
| --- | --- | --- |
| `displayName` | Not an NHI. A local fictional label | NHI is a national identifier. Inventing realistic NHI values is harmful |
| `encounterId` | An internal UUID. Later, a local encounter identifier, not a swapped-in NHI | Identity and the encounter are different |
| `statements` where topic is allergy and status is not a confirmed explicit allergy | Do not map to an AllergyIntolerance with `clinicalStatus` active | Uncertain penicillin must not become a coded allergy |
| `NEGATED` statements | A negation or a refuted finding, if a specialist confirms a representation | Getting negation wrong in FHIR is how H2 happens in the EHR |
| `STAFF_OBSERVED` | Observation, only for things that were actually observed | A question is not an Observation |
| `AI_HIGHLIGHTED` | An extension or a note that is clearly non-clinical-assertion, or omitted from the legal record | Highlights must not land as conditions |
| `informationToClarify` | A task or a communication request the nurse owns | Not a detected diagnosis |
| `clinicianAts.category` | The ATS value the clinician recorded, in whatever code system the receiving ED already uses | Only after the nurse set it. Never model-authored. The code system itself was not confirmed in this pass |
| `approval` | Provenance resource: who approved, when | Attractive and still post-hackathon |
| `transcript` | Not automatically the designated record | Retention and legal-record status are open |

SNOMED CT is the terminology direction **KNOWN** from the standards page. Coding topics in the MVP would create false precision (`topic: "chest pain"` is a string). A later coder, human or assisted, can bind codes after the nurse confirms the statement. Automatic coding is out of scope for the same reason diagnosis is out of scope.

NZCDI is a core data set for exchange, **KNOWN** as a named standard. Which elements a brief would satisfy is **REQUIRES SPECIALIST CONFIRMATION**. Do not claim NZCDI conformance.

## EHR and scribe compatibility

MVP compatibility means paste. The nurse copies text from the EHR or from Heidi into the transcript box, then copies the handover back if a human decides to. There is no write token.

Production options, in the order to try them:

1. Keep paste. Measure whether nurses do it (validation plan).
2. Export a PDF or plain-text handover the nurse files.
3. Only then, a FHIR write behind the health system's gateway, with the mappings above reviewed.

Epic, CareFlow, and Heidi each have their own integration story. None is a weekend adapter. Vendor-specific APIs were not specified here on purpose.

## Australian note

Australian EDs often exchange under different national programs than NZ Base. Do not assume NZ Base profiles are valid in Australia. A second mapping exercise is required. Out of hackathon scope.

## Explicit non-build list

- No `nhi` column.
- No FHIR client library in `package.json` for the MVP.
- No SNOMED lookup.
- No HL7 v2 message.
- No claim of FHIR-first implementation. The policy applies when we exchange health data. The MVP does not exchange health data.
