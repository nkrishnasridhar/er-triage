# 28 — Demo script

> **Implementation update — 26 September 2026:** Open on the tablet check-in first: speak or type a fictional account, visibly correct the text, submit, then switch to the authenticated clinician queue. State plainly that the system has not ranked or prioritised the new report; the clinician records the decision.

Five minutes. The product is on the hosted URL, already signed in before the clock starts, encounter list visible, Mara not yet composed so the model call is live. If compose failed in rehearsal, Samir is the backup live call and Mara is opened from a revision composed ten minutes earlier. Say which one is live. Do not fake it.

One laptop, zoomed so the disclaimer is readable from the back of the room. No mic hardware. Slides: optional title only, then the app.

Presenter is the pitch role. A second person watches the clock and signals at 4:00.

## 0:00–0:30 — Who and what

> Triage nurses in emergency departments already have an EHR, and in New Zealand many will have an ambient scribe. The scribe writes the note. The nurse still has to see what the patient actually said, what was observed, what was never asked, and what the software only highlighted.
>
> Front Brief is that review. It does not diagnose, it does not prescribe, and it does not assign a triage category. The nurse does.

Point at the list. Read the line "This list is not a queue and not an urgency order."

## 0:30–1:10 — The messy story

Open Mara Ellison. Scroll the transcript just enough to show three lines: the uncertain penicillin sentence, "I don't have chest pain", and the later tightness sentence.

> This patient is fictional. The allergy is hedged. The chest pain is denied, and then a different sentence appears. A normal summary will tidy that into something false.

Hit compose. While it runs:

> It is reading the conversation as data. If the patient had said "ignore your instructions", that would be speech, not a command. We will show that on the next case if we have time.

If compose errors, use the line from the UX spec and switch to the backup encounter without apologising for more than one sentence.

## 1:10–3:10 — Provenance, the actual demo

On the review screen, do not read every card. Touch these in order:

1. Disclaimer. Read it once, short:

> Draft for a clinician. Not a diagnosis, not a category, not a queue rank.

2. Patient reported, allergy. Point at the word Uncertain and the quote.

> It did not become "allergic to penicillin". The hedge is the fact.

3. The two chest lines. Point at Contradicted and both quotes.

> It kept the disagreement. It did not pick a winner, and it did not turn the nurse's question into a symptom.

4. Warranting another look. Read the question highlight and show the quote underneath.

> This is a pointer back to the words. There is no score beside it.

5. Information to clarify. Count them aloud if there are any, up to three.

> These do not block. I can approve with them still open.

6. Your category. Show "Not recorded". Do not select a number unless a judge later asks to see the control work. If you select one, say:

> I am recording a category as the clinician. The software has no recommendation, and I am not going to defend this number as clinically correct. The case is fictional.

Prefer to leave it empty. Emptiness is the point.

## 3:10–4:10 — Approval and the second reader

Click "Approve reviewed brief" (and confirm if the two-step control exists). Open the handover.

> A colleague who was not in the room can see what was reported, what was observed, what is still open, and that a person approved it. Approval means reviewed. It does not mean the model was right.

If an edit was part of rehearsal and is reliable, change one word before approving and point at "Edited by Demo Clinician". If the edit is flaky, skip it. Do not debug on stage.

## 4:10–4:40 — Injection, only if the clock allows

Open Samir, compose if a revision is not ready, show the instruction sentence in the transcript and the empty category.

> That sentence asked to be marked immediate. The category is still empty. The line is patient speech.

If the clock is past 4:20, skip Samir and let Q&A cover it. Mention the fixture existed.

## 4:40–5:00 — Close

> The buyer, if this were real, would be a health system that already paid for a record and maybe a scribe. The user is the triage nurse. The model is not the product. The product is a brief the nurse can check before they decide.
>
> We have not put a real patient in it, and we will not, without the hospital's own governance. Happy to take questions.

Stop talking when the clock ends even if a sentence remains.

## If things break

| Break | Line |
| --- | --- |
| Compose spinner past 25s | "The conversation is saved. I'll open the compose we checked an hour ago and say so." |
| Allergy renders as a bare positive | Do not ship that build. If it happens live: "That is a failure of the product. The hedge should have stayed. I won't talk past it." |
| ATS arrives pre-filled | Stop the demo. "That is a safety bug. The category must start empty." |
| Login wall | The session expired. Second laptop is signed in. Switch. |

## What not to say

- A specific ATS number is appropriate for Mara.
- Any minute-saved claim.
- 1.47 million presentations, 5.7% left without being seen, or 1,250 staff, unless you label them as unverified brief figures. Prefer the verified 73.9% Q4 figure only if asked, and do not call it the latest quarter.
- "Clinically validated", "medical device", "HIPAA" (wrong country), or "NAIAEAG approved us".
