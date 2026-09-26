# 19 — Observability

> **Implementation update — 26 September 2026:** Composition failures use deterministic fallback and never log submitted text, raw model output, API credentials, speech audio, or a clinical decision. `drafted_from`, `submission_source`, `speech_used`, and staff-role audit rows are database provenance, not telemetry payloads.

## Recommendation

Log structured events with codes and timings. Do not log clinical text. The demo is synthetic, and the rule still holds, because the next environment will copy the logger.

## Events worth having

| Event | Fields |
| --- | --- |
| `compose_started` | `encounterId`, `charLength`, `requestId` |
| `compose_succeeded` | `encounterId`, `revision`, `latencyMs`, `model`, `statementCount`, `gapCount`, `highlightCount`, `droppedStatementCount` |
| `compose_rejected` | `encounterId`, `code`, `latencyMs` |
| `action_failed` | `action`, `code` |

Counts are numbers. They are not a severity score and must not be shown in the UI as one.

## What must not go in standard logs

- Transcript body, including fragments.
- Context note.
- Statement text, highlight text, gap prompts, quotes.
- The system prompt (it is in git; it does not need to be in logs, and a log pipeline is a worse place).
- Model raw output.
- API keys, cookies, authorization headers, service-role key.
- The demo password.
- A category value, if you can avoid it. `atsSet: true/false` is enough in logs. The value is in the database the nurse can see.
- Any real person's name if one is ever typed by mistake. You cannot reliably detect this. The mitigation is "do not log free text", not a regex for names.

Vercel request logs and `console.log` of an action's input violate this if the input includes the transcript. Log after parsing, and log the code only.

If a debugging session truly needs a payload, write it to a local file that is gitignored, on one laptop, and delete it the same hour. Do not add a "debug: true" that dumps bodies in production.

## Error tracking

If Sentry or a similar tool is added, set it to strip request bodies and breadcrumbs that contain form data. If that configuration is uncertain, do not add the tool this weekend. Browser `alert` of an error code is worse than the in-page copy; use the in-page copy.

## Health

A `/` or existing route that returns 200 is enough for "is it up". Do not build a status page.

Optional: `compose_rejected` count during the demo hour. If every compose fails, roll back the deploy. That is the operational signal.

## Trace correlation

`requestId` is a uuid per action, returned only in logs, not shown to the judge. It links start and finish without using the patient's name.

## Audit versus telemetry

`audit_events` is the product record (who approved). Telemetry is the engineering stream (how long compose took). Do not merge them into one table that then gets shipped to a third-party logger.

## Retention

Demo logs follow the host's default. Do not buy a log vendor. Before any pilot, retention of telemetry is part of the privacy confirmation in [16-privacy-governance-regulatory.md](16-privacy-governance-regulatory.md).

## Alerts

No pager. One person watches the hosted compose during rehearsal. If it fails, they read `code`, not a transcript, and use the last good deployment.
