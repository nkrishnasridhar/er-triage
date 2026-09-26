# 22 — Business model

These are hypotheses and the experiments that would falsify them. None is a forecast.

## Who pays

**Hypothesis B1.** The buyer is a health system, not the nurse. In New Zealand the plausible buyer is Health New Zealand or a delegated hospital operator. In Australia it would be a state health department or hospital network. The nurse is the user. The pitch names the buyer and shows the nurse's screen.

**Falsifier.** Interviews show that ED leadership will not sponsor a tool that sits beside Heidi, and there is no other budget holder. If both are true, there is no business yet.

**Hypothesis B2.** The purchase is a site subscription (per ED), not a per-patient fee. Per-patient pricing punishes busy departments and creates a bad incentive to open the tool on people who do not need it.

**Falsifier.** Procurement says they only buy through an existing EHR line item. Then the route is a partner, not a direct site licence. Still a hypothesis.

We do not know the price. [21-cost-model.md](21-cost-model.md) refuses invented comparables.

## Why they would pay

**Hypothesis B3.** The pain is not "writing takes time" (Heidi's pitch, already in market). The pain is a thin or misleading triage record: negations lost, questions written as facts, handover that cannot show what was missing. A system might pay to reduce rework and unsafe misunderstanding at the front door.

**Falsifier.** Nurses say the EHR template plus the scribe already shows this, or that the real pain is beds and staffing, which a brief cannot move. The Press reporting on ED crowding, quoting Peter Jones, points at access block. If buyers only care about the six-hour target's bed problem, Front Brief is the wrong product. Say that before they do.

## Why they would come back

**Hypothesis B4.** Every new presentation is another brief. The reason to return is the next patient, not a weekly report. That matches the SaaSathon "reason to return" test, if B3 is true.

**Falsifier.** Nurses try it twice and go back to a single note because two artefacts are worse than one.

## What is being sold

A reviewed evidence brief with an audit of what the clinician changed. Not a model API. Not acuity automation. Selling acuity automation would be a different company (KATE, TriageGO, ERTRIAGE) and would contradict the safety constraints.

## Experiments

| # | Experiment | Pass signal | Fail signal | When |
| --- | --- | --- | --- | --- |
| E1 | Five triage nurses compare a pasted Heidi-style note with a Front Brief review on the same fictional transcript | At least three say the brief shows something they would otherwise miss, unprompted | They say it is a slower scribe | Before any pilot conversation |
| E2 | Two charge nurses or clinical nurse managers asked who would sign a purchase | A named budget path | "Interesting" and no owner | After E1 |
| E3 | One privacy or digital lead asked what would block a synthetic simulation inside their training environment | A written list of gates | A flat no to any software of this shape | Before pilot planning |
| E4 | Measure cost per compose from real tokens | Number exists | n/a | Sunday, optional |

E1 is the only experiment that fits immediately after the hackathon, and only with fiction. Questions are in [23-validation-plan.md](23-validation-plan.md).

## Go-to-market we will not do this weekend

- A waiting-room poster.
- A claim about the six-hour target.
- A price list.
- An approach to a specific hospital as if we are in procurement. Mentors and voluntary conversations are fine. Cold emails to clinical directors during the build are a distraction.

## Competitive response

If Heidi ships gap detection inside the scribe, B3 weakens. The residual claim would be audit of epistemic status and a refusal to score acuity. That may be too thin to buy. The roadmap should watch their public release notes rather than assume the gap remains. See [02-competitive-landscape.md](02-competitive-landscape.md).
