# ER Triage: Product Goal

## Product in one sentence

ER Triage helps emergency-department staff turn a patient's initial presentation into a clear, structured triage brief so a clinician can assess urgency faster, document consistently, and decide what happens next.

## The problem

Emergency departments often begin with a crowded waiting room, limited staff time, and patients whose needs range from minor to immediately life-threatening. The first clinical conversation is essential, but it can be slowed by manual note-taking, incomplete information, inconsistent handover, and the pressure of deciding who needs attention first.

Those delays have real consequences: patients can wait longer than necessary, staff can be pulled away from care to document, and the team can have less shared clarity about each person's presenting concern and potential urgency.

## Our goal

Create a tablet-based intake and triage-support experience for use in an emergency department. It should help staff capture what matters from a patient's first interaction, organise it into a concise report, and surface the information a qualified clinician needs to make a timely, accountable decision.

The product exists to reduce avoidable administrative delay and make the first stage of emergency care more consistent. It should support, never replace, professional clinical judgement.

## The core workflow

1. A person uses a dedicated tablet to enter a local reference and their account by typing or browser speech-to-text, then confirms the text before sending it.
2. The tablet submits no audio and cannot access other reports, queue contents, or clinician decisions.
3. A server-only AI boundary organises the captured text into a source-preserving brief and neutral clarification prompts. It falls back to deterministic rules if a provider response is unavailable or unsafe.
4. A clinician on the authenticated desktop workspace reviews and corrects the brief, then makes the final decision about priority, assessment, escalation, and next steps.
5. The approved report becomes a clear handover and record for the care team.

For the first SaaSathon demo, the most valuable workflow is deliberately narrower: guide an intake conversation, produce a structured triage brief, and show a human clinician reviewing it before it is saved or acted on.

## Features

- **Tablet check-in:** An anonymous, touch-first surface captures a confirmed account without exposing clinical records.
- **Speech-to-text convenience:** Browser recognition fills an editable text field; typing is always available and audio is not stored.
- **Focused intake questions:** Capture the presenting concern, symptoms, timeline, severity, relevant warning signs, and unanswered follow-ups.
- **AI-organised draft:** Turn the conversation into an easy-to-scan report with captured wording, source-linked items to check, and neutral clarification questions.
- **No AI priority or attention rank:** The system never suggests, assigns, colours, or reorders urgency, escalation, priority, or queue position.
- **Clinician review and decision:** A qualified clinician can edit the brief and choose the approved next step, such as immediate assessment, priority assessment, or an appropriate discharge pathway.
- **Clear handover record:** Save the clinician-approved brief as a consistent handover for the care team.

## Who it helps

The primary users are emergency-department nurses, triage clinicians, and other staff responsible for receiving and assessing patients. They need a fast, consistent way to turn an initial conversation into information that the wider care team can use.

Patients benefit indirectly through a clearer intake process, less repetition of their story, and a better chance that time-sensitive concerns are visible sooner. The product must remain usable when patients are stressed, in pain, have limited health literacy, or need assistance to communicate.

## What a good outcome looks like

- Staff spend less time writing and reformatting notes during intake.
- Clinicians receive a concise, consistent summary instead of reconstructing the patient's story from fragmented notes.
- Relevant warning signs and missing information are easier to notice and follow up.
- Every urgency and disposition decision remains visible as a clinician-owned decision, with an opportunity to amend the AI-generated report.
- Patients move through the front door of the emergency department with less avoidable delay and confusion.

## Product principles

### Human decision-maker, always

The app can organise captured information and identify wording to verify, but it must not diagnose, prescribe treatment, independently assign triage categories, recommend priority, or rank the queue. A qualified clinician has the final say and can edit the draft before recording a decision.

### Useful under pressure

The experience should be fast, calm, and clear on a shared clinical tablet. It should ask only for information that helps the next decision and return a report that can be scanned in seconds.

### Clear provenance and accountability

The report should distinguish what was said or observed from what the AI inferred or highlighted. The final clinician-reviewed version should make it clear who approved it and what next step was chosen.

### Equity, dignity, and accessibility

The product should support varied communication needs and avoid treating a patient's ability to speak, type, or describe symptoms in a particular way as evidence of lower urgency. It should be designed with clinical, patient, privacy, and cultural input before real-world use.

### Safety before speed

Reducing wait time matters only when it improves care safely. The product should favour clear escalation and human review over false certainty or automation theatre.

## What this is not, yet

This is not a replacement for emergency clinicians, a diagnostic tool, an autonomous patient-ranking system, or a claim that AI can safely determine medical urgency by itself. It is also not a full electronic health record.

The current goal is a focused front-door workflow that turns a messy first presentation into a clinician-reviewed triage brief.

## Why someone would pay

The initial commercial hypothesis is that public health systems, hospital networks, or emergency-department operators could pay for a product that helps teams manage intake more consistently, reduces documentation burden, and improves visibility at the front door.

That is a hypothesis, not a validated business case. Before pitching a government buyer, the team needs evidence from emergency clinicians, hospital operations leaders, patients, and privacy and safety stakeholders that the workflow solves a real pain point without creating new clinical, legal, or equity risks.

## Questions to validate next

- Which part of emergency intake causes the most repeat work or delay today?
- Who owns the triage workflow, and which staff member would use the tablet in practice?
- What report format would clinicians actually trust and use in a handover?
- Which information can be captured safely before a clinician assesses the patient?
- What safeguards, validation, privacy requirements, and clinical governance would be required before any real patient use?
- What measurable outcome matters most to a hospital: time to first assessment, documentation time, handover quality, safety signals, patient experience, or flow?

## A simple pitch

**ER Triage gives emergency staff a faster way to turn a patient's first story into a clinician-reviewed triage brief, helping the right information reach the right person sooner.**
