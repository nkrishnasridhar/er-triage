# 23 — Validation plan

Purpose: find out whether a triage nurse who already has an EHR and, in New Zealand, possibly Heidi, would still use a provenance brief. The plan uses fictional transcripts only. It is not a clinical study. It does not need an ethics committee only if it stays at "opinions about a fake scenario". The moment someone is asked about real patients they cared for, stop and reconsider. **REQUIRES SPECIALIST CONFIRMATION** if the conversation could collect health information.

Do this after Sunday, not during the build, except for one mentor who already works in ED if they walk past the table. Do not let that conversation add features before the freeze.

## Who to ask

- Triage nurses (users). At least five, not all from one shift.
- One or two charge nurses or ED clinical leads (buyer influence).
- Not patients, in this round. Patient trust matters later and needs a proper design. A hackathon corridor is the wrong place.

## Setup

Give them the Jules transcript on paper, then show the hosted brief if they want to see it. Ask them to think aloud. Do not ask "would you use an AI triage tool?" That question invites politeness.

Tell them the cases are fictional and ask them not to substitute a real patient.

## Questions that test the wedge

1. Walk me through the first five minutes of triage on your last shift. What did you write, and where?
2. If a scribe had already produced a paragraph, what would still be wrong or missing often enough to annoy you?
3. On this page, what did the patient say, what did the nurse see, and what did the software add? (If they cannot answer, the UI failed. Do not explain it first.)
4. Here the patient says they are not sure about penicillin. How would that land in your current record? What would you want on screen?
5. The nurse asked "any chest pain?" and the patient said no. Where have you seen a question turn into a symptom in the notes?
6. There are three questions under "Information to clarify", and you can finish without answering them. Is three too many when the waiting room is full? What number would you tolerate?
7. This control records your ATS category and starts empty. Does that help, or does it look like the computer is about to fill it in?
8. What would you need to believe before you trusted a handover written this way from a colleague?
9. Heidi or the EHR template already does ____. Finish that sentence. What is left?
10. If this disappeared tomorrow, what work would you actually miss? If the answer is "nothing", believe them.
11. Who, by role, would have to say yes before this could be tried with acted scenarios in your department?
12. What on this screen would you refuse to have in front of a patient?

## What to record

Quotes, the task they say is painful, and whether they could distinguish source kinds without help. Not a net promoter score.

## Decision rule

Continue only if at least some nurses independently describe a completeness or provenance problem, and can use the review screen. A room full of "AI is the future" is a fail. A room that says "I just need the scribe to be faster" is a fail for this product, and a useful result.

## This weekend

The demo is not validation. Judges are not users. Do not add their feature requests to the build after 09:00. Write them on the backlog as post-hackathon.
