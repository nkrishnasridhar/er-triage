# 13 — Provenance and trust

## Recommendation

Trust is a property of the screen and the revision log, not a property of the model. The nurse should be able to answer seven questions without reading a prompt:

1. What did the patient report?
2. What did staff observe?
3. What context was explicitly provided?
4. What did the AI only highlight?
5. What is unanswered?
6. What warrants another look, and which words is that tied to?
7. What did the clinician change or approve?

If any answer requires a tooltip that says "the AI is usually right", the design has failed.

## Source kinds

| Kind | Who may create it | Meaning on screen |
| --- | --- | --- |
| `PATIENT_REPORTED` | Extractor, from patient speech | "The patient said this" |
| `STAFF_OBSERVED` | Extractor from staff observation lines, or the nurse via `addObservation` | "Staff saw or measured this" or "Added by clinician" |
| `CONTEXT_PROVIDED` | Extractor from explicit context, or the context note | "This was given as context" |
| `AI_HIGHLIGHTED` | Assembler templates only | "This is a question or a pointer. It is not a new fact" |

The model cannot mint `AI_HIGHLIGHTED` statements that assert facts. Highlights are not statements. They do not enter the statement list.

## Epistemic status

| Status | Display word | Forbidden simplification |
| --- | --- | --- |
| `EXPLICIT` | Explicit | Adding measurements nobody said |
| `UNCERTAIN` | Uncertain | Dropping "I think" / "not sure" |
| `NEGATED` | Negated | Showing the symptom as present |
| `CONTRADICTED` | Contradicted | Merging into one "resolved" sentence |
| `UNKNOWN` | Unknown | Filling a normal value, including "no known allergy" |

`UNKNOWN` is rare on purpose. Absence of a statement is the usual way to show that something was not said. A gap asks about the absence. An `UNKNOWN` statement is for a topic the conversation opened and did not close, when a gap would be worse. Do not generate a checklist of body systems marked unknown. That checklist looks like a negative review of systems the nurse did not perform.

## Quote integrity

A span is the provenance. The quote is copied, not paraphrased. The paraphrase lives in `statement.text` and is labelled by status. The nurse can see both.

If the quote check fails, the statement does not exist. There is no "approximate match" in the MVP. Fuzzy quotes hide injection and mis-hearing.

Clinician-added observations are the exception in [11-api-contract.md](11-api-contract.md): they are labelled "Added by clinician" and use a zero span so they are not fake transcript quotes.

## Edit provenance

Every edit creates `brief_revisions` with `actor_id` and `source`. The handover does not need a full diff widget for the demo. It needs one line if the head revision's source is not the original compose: "Edited by Demo Clinician."

The pre-edit payload remains the previous revision. Do not update in place.

Approval stores `approvedBy` and `approvedAt` inside the document and on `briefs`. Approval language is "reviewed", not "AI accepted".

## What warrants another look

This region is a set of pointers produced by fixed templates: contradiction, uncertainty, negation. Each pointer includes a quote. They are ordered by position in the transcript.

They are not:

- a score
- a rank against other patients
- a prediction of deterioration
- a colour
- a count used as severity ("3 items" is allowed as a simple length of the list; do not subtitle it "3 risks")

The section title is exactly "Warranting another look".

## What the nurse is asked to trust

The product asks the nurse to trust that:

- quotes are substrings (testable)
- the ATS field is not model-writable (testable)
- gaps do not block (testable)
- illegal keys are rejected (testable)

The product does not ask the nurse to trust that the extraction is complete. The empty-highlight and open-gap states are honest. Completeness is the nurse's job, assisted by at most three questions.

## Handover quality

A handover is good when a second clinician, who did not hear the conversation, can separate those seven questions. The demo script has the presenter play that second person for thirty seconds. That is the test we can run on Sunday. It is not a clinical trial.

## Alternatives

Showing a raw chain-of-thought is rejected. It leaks rambling clinical assertions and is not stable provenance. The quote is the provenance. A probability is rejected in ADR-006.
