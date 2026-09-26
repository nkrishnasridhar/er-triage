# 04 — MVP scope

> **Implementation update — 26 September 2026:** Tablet capture is now in scope at `/`; it is anonymous, text-confirmed, and audio-free. The earlier “patient-facing app” and “mic-first” exclusions are superseded only to this limited extent. AI urgency ranking, suggested ATS, risk scores, and queue ordering remain explicit non-goals.

One recommendation: the demo is a pasted transcript becoming an approved, source-linked brief. Everything that does not serve that path is optional, then cut.

Hours refer to [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md). If a trade-off appears, cut from the bottom of "cut first" upward, never from "must build".

## MUST BUILD FOR DEMO

| Item | Done when |
| --- | --- |
| Hosted Next.js app on Vercel, Supabase project used only for this demo | Judge URL opens |
| Seeded clinician session | One sign-in, no signup maze |
| Encounter list and create | Fictional name plus context |
| Transcript paste and save | Survives a refresh |
| Compose pipeline: extract, gaps, deterministic assemble | Schema-valid brief |
| Review screen sections in [06-ux-specification.md](06-ux-specification.md) | All eight visibilities |
| Epistemic fixtures: uncertain allergy, negation, question-is-not-evidence, contradiction | Tests pass on fixtures even if the live model is flaky; live model must pass Mara once before freeze |
| At most three "Information to clarify" items, non-blocking | Approve works with them unanswered |
| Highlights are questions or pointers with quotes | No new clinical assertion |
| Empty ATS dropdown, clinician-only write | Network response from compose has no category |
| Edit a statement and see the change attributed | Revision row exists |
| Approve and open handover | Disclaimer still visible |
| Samir injection fixture | No ATS write, no diagnosis |
| Safety copy on every brief view | Exact strings from the UX spec |
| `synthetic = true` constraint | Migration applied on the demo database |

## SHOULD BUILD IF TIME

Build only after the must-list is deployed.

| Item | Stop if |
| --- | --- |
| Amend after approval (new revision) | Approve-lock already works |
| Dismiss a highlight with one click | It can be left visible |
| Answer a clarification into context and re-compose once | Manual edit already fixes the brief |
| Fourth seed encounter used only as an offline test | Demo only needs three |
| Keyboard-first pass on the review screen | Mouse path is solid |
| Simple print stylesheet for handover | Screen handover is enough |

## CUT FIRST

In this order, the moment the clock slips:

1. Live microphone and any audio upload.
2. Streaming tokens on the review screen.
3. A third model call that "writes the summary".
4. Accounts other than the seed clinician. Hide signup if the starter shows it on the demo path.
5. Animations, custom illustrations, new fonts.
6. Dark mode.
7. Internationalisation framework.
8. Email magic-link copy changes beyond what sign-in needs.
9. Mario Kart, extra slides, a marketing site with more than one screen.
10. Numeric anything that looks like confidence, even in logs.

## POST-HACKATHON

Not scheduled before Sunday 10:00 NZDT.

- RBAC and break-glass access.
- FHIR, NZ Base, NHI, SNOMED, NZCDI mappings.
- Real audio with a tested manual fallback.
- Multi-encounter queue management, ambulance pre-arrival, waiting-room display.
- Pilot governance pack execution, ethics, Māori data governance partnership.
- Billing, SSO, tenant isolation beyond one demo user.
- Fine-tuning, eval harness in CI against a paid model, human factors study.
- Replacing or deeply integrating Heidi or the EHR.
- Patient-facing app.

## Explicit non-goals

| Non-goal | Why it is attractive | Why it is refused |
| --- | --- | --- |
| Suggested ATS | Looks clinical and demoable | It is the thing we must not do. Contradiction 1 |
| Risk score beside highlights | Easy to sort | Becomes implicit triage. Contradiction 2 |
| Required gap completion | Feels safer | Slows the two-to-five-minute window and blocks the nurse. Contradiction 3 |
| Mic-first demo | Feels like AI | Too much UI, and it recentres the product on transcription. Contradictions 4 and 5 |
| FHIR patient resource | Sounds interoperable | No time, and it implies a real identity. Contradiction 6 |
| Confidence 0.82 | Familiar model output | Read as clinical certainty. Contradiction 7 |

## Demo encounters (synthetic)

All three are fiction. Do not add clinical "expected ATS" to the fixture. A human may choose a category during the demo and must not narrate it as the right clinical answer.

| Id | Name | Teaches |
| --- | --- | --- |
| `enc_mara` | Mara Ellison | Uncertain penicillin allergy, negated then contradicted pain language |
| `enc_jules` | Jules Pene | Nurse asks "Any chest pain?"; patient denies it. Ankle injury story |
| `enc_samir` | Samir Holt | Injection sentence; short answers; manual-entry equity copy |

Full text lives with the schema example and test fixtures specified in [10-triage-brief-schema.md](10-triage-brief-schema.md) and [18-testing-strategy.md](18-testing-strategy.md).

## Relationship to the starter

Keep `public.ideas` and the current login working until the encounter feature replaces the home screen. Do not drop the starter migration. Add a new migration only. Home route for the demo should become the encounter list after sign-in, with the ideas page left reachable but not in the script.

## Definition of demo-complete

Saturday 23:30 NZST: local path works for Mara. Sunday 07:30 NZDT: hosted path works for Mara and Samir. Sunday 09:00 NZDT: freeze. If the hosted path fails at 07:30, fix hosting, do not add scope.
