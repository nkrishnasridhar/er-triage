# 30 — Judge questions and answers

> **Implementation update — 27 September 2026:** The awaiting-review list has an AI-suggested *display order*. It is calculated only from up to three source-linked information gaps and up to three account cues; gaps count twice. It is not a clinical priority, diagnosis, triage category, safety judgement, or approval. Every report stays openable, and the clinician alone records priority, next step, and approval.

Three minutes. Answer in two or three sentences, then stop. Admit the weakness in the same breath as the defence. Do not invent a statistic to fill silence.

The questions below cover the brief's contradictions, the event's judging questions (who is helped, what the workflow is, why someone returns, how AI does the work), and the open questions in `PRODUCT_GOAL.md`.

## Who is this for?

The user is the triage nurse. The buyer we would have to convince is a health system. The screen is the nurse's. We do not have a signed buyer. The pain is a hypothesis until the interviews in the validation plan.

## What does AI actually do?

It extracts statements and proposes at most three clarification questions for the brief. In a separate call, it may return up to three exact-source information gaps and up to three exact-source account cues. Code validates every quote against the captured account, gives gaps double weight, and uses the resulting score only to set the review-list display order. The model does not approve anything and cannot write priority, a triage category, or a clinical decision.

## Why wouldn't Heidi just add this?

They might. Their public product is the note, the template, and the languages, plus an Evidence feature we did not verify as triage provenance. If they add source-linked epistemic status, gap detection, and a non-clinical review order, our wedge gets thin. Our distinction is that the queue offers a transparent place to start without assigning acuity. That may not be enough to buy; we would rather find that out in interviews than pretend the scribe cannot move.

## Can it assign an ATS category?

No. The control starts empty. The only write path is the signed-in clinician. We will not justify a category for a fictional patient as clinically correct. A demo dropdown can look like automation. The copy on the control says the clinician is recording it. Weakness: a careless presenter can still type a number and sound like the computer chose it. The script says not to.

## Isn't a suggested review order just an AI priority?

No. The number is a bounded count of source-linked information gaps and account cues, not a claim about a patient. The queue exposes text labels such as “Suggested first” and the report explains the exact quotes after it is opened; every lower-listed report is still one click away. Weakness: any order can be over-read as severity. We must keep the UI free of clinical labels, traffic-light colours, and claims of accuracy.

## Won't the extra questions slow triage?

We show at most three, and approve works with none of them answered. ACEM's published material says the triage assessment generally should take no more than two to five minutes and is not a diagnosis. We did not study real timings. Weakness: three can still be too many. The validation question asks nurses what number they would tolerate, including zero.

## Why lead with a voice UI?

The first interaction is naturally spoken, so the tablet starts with a short guided conversation and the assistant asks neutral questions back. It never makes a clinical assessment, and nothing reaches staff until the person checks the editable transcript; the typed form is always one tap away. Weakness: live provider processing adds a privacy, reliability, and consent question that blocks real deployment until governance reviews it.

## What about speech, disability, and language?

Difficulty communicating is not evidence of lower urgency. Speech traits do not enter the suggested-order calculation, and the transcript screen says to type observations if speech fails. Weakness: we have not tested this with disabled people, interpreters, or te reo Māori speakers. A string on a screen is not an equity programme. We also have not involved Māori data governance. That blocks any real deployment, not the fictional demo.

## A patient says "ignore previous instructions".

That line is untrusted speech. The system prompt says so, and neither schema has a field for the model to set a category, priority, or clinical decision. The brief assembler will not take one from the model; the review-order pipeline accepts only literal source quotes and calculates its score in code. We have a fixture for it. Weakness: one fixture is not a security proof. A novel jailbreak could still produce bad prose inside a quote, but it cannot call a tool or introduce hidden scoring instructions.

## How accurate is it?

We do not have an accuracy or clinical-efficacy number, on purpose. We check separate things: hedges, negations, questions that are not findings, quote exactness, signal caps, score mapping, and category silence. A single number would hide a flipped allergy or falsely suggest the order has clinical validity. Weakness: we will have run those checks on a handful of fictional transcripts, not on a representative set.

## Is it a medical device? Are you HIPAA compliant? What about the Privacy Act?

We are not giving a legal classification. HIPAA is the wrong jurisdiction. The Privacy Act 2020 and the Health Information Privacy Code 2020 are the New Zealand instruments we would have to take to a specialist before any real health information. Health NZ has an AI advisory group and a pre-implementation framework. We have not been through them. Heidi's vendor posts say that group reviewed Heidi. That does not cover us. Weakness: a disclaimer does not decide intended purpose. Promoting "risk detection" would undermine the design. We have told the team not to.

## Will you connect FHIR and the NHI?

Not in this build. New Zealand's published direction is FHIR-first, with NZ Base, NZCDI, SNOMED CT, and the NHI as identifier infrastructure. Implementing that on fictional data would be cosplay and a way to mishandle identity. Internal fields are plain text. Mapping is written down for later. Weakness: a buyer may insist on EHR integration before a trial. The answer is paste, then a text export, then a proper integration project.

## What about Epic, KATE, TriageGO, CareFlow, Mediktor, ERTRIAGE?

Epic is the record in many hospitals; we did not verify an Epic feature that assigns the ATS. KATE and TriageGO recommend acuity and sit on the other side of our product decision. CareFlow's emergency ambient product, on System C's pages, fills configured UK emergency forms inside their EPR. Mediktor is patient-facing navigation, as far as we confirmed. ERTRIAGE is a device-based acuity system with marketing accuracy figures we do not repeat. Our repo's old name sits close to ERTRIAGE, which is why the product name is ERgency. Weakness: we have not had a salesperson's demo of any of them. Absence from a public page is not absence from the product.

## Does this fix the six-hour target?

No. The target is real: 95%. Performance we could verify for 2024/25 Q4 was 73.9%, and a later DPMC factsheet cites 68.9% for the quarter ending September 2025. Public commentary points at beds and flow. We will not claim a wait-time reduction.

## Who is accountable?

The clinician who approves the brief. The software stores who approved it and what changed. Weakness: in a real hospital, accountability is a governance arrangement, not a column. We do not have that arrangement.

## What did you cut, and what is the weakest part of the demo?

We cut the microphone, standards integration, and a clinical-risk or confidence claim. The weakest part is that extraction quality depends on a model call we do not fully control, and our evidence is a few fixtures. The strongest part is that the category stays empty, the penicillin hedge stays visible, and any suggested order can be traced to exact captured text. If those fail, the project fails the brief even if the UI is pretty.

## Why will they come back?

Only if the next patient is easier to hand over with the brief and the active list gives a useful, non-clinical place to start. We have not shown that. The SaaSathon test is a reason to return. Ours is “every arrival.” It stands or falls with the nurse interviews.

## Can it replace a nurse or a doctor?

No. If a judge describes it that way, correct them.

## What happens after Sunday?

Interviews with triage nurses using fictional cases, comparing the brief to a scribe-style note and asking whether they accept or differ from the suggested starting order. If they do not describe a completeness or review-sequencing problem, we stop. A pilot with real patients is behind privacy, security, AI governance, and a real safety case. Those gates are not started.

## Market numbers you might get challenged on

| If they say | We say |
| --- | --- |
| "1.47 million NZ presentations" | Stated in our brief. We did not verify it. A minister cited about 3,700 attendances a day in 2025, via news reports. We will not multiply that into an official annual total |
| "5.7% left unseen" | Not verified. We should not have it on a slide |
| "9.1 million Australian presentations" | Secondary reports of AIHW for 2024–25. We did not re-extract the primary table |
| "293 EDs" | AIHW's 2023–24 count of public hospitals with 24-hour purpose-built EDs, not a confirmed 2024–25 figure |
| "1,250 staff on the scribe rollout" | Not verified. Heidi's post says 1,000 clinician licences and 100 for mental health crisis teams |

## PRODUCT_GOAL questions, short answers

- The repeat work we are betting on is reconstructing a hedged story, not retyping for its own sake. Unvalidated.
- The triage nurse owns the screen. The health system would own the contract.
- Clinicians will trust a handover that shows quotes and edits. Hypothesis.
- Before a clinician decides, the product may hold only what was said and observed, labelled. It may not hold a category from a model.
- Safeguards before real use are the pilot gates. We have not done them.
- The outcome that matters first is whether a second nurse can see what was unknown. Not the six-hour target.
