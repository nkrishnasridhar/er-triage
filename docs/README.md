# ERgency documentation

ERgency is the SaaSathon product specified in this repository. The npm package and GitHub repo remain `er-triage`. The public name is ERgency so the pitch does not collide with CAREPOI's ERTRIAGE product.

This tree is the build specification. It does not implement the product. The starter app (ideas, login, Supabase) stays in place until a later implementation pass follows these docs.

Read [32-cto-decision-summary.md](32-cto-decision-summary.md) first if you are about to write code. It is the decision record. Where an earlier note disagrees, follow that file and [04-mvp-scope.md](04-mvp-scope.md).

## How to use this set

| If you are… | Start here |
| --- | --- |
| Deciding what to build before Sunday | [04-mvp-scope.md](04-mvp-scope.md), [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md), [32-cto-decision-summary.md](32-cto-decision-summary.md) |
| Implementing the brief | [10-triage-brief-schema.md](10-triage-brief-schema.md), [11-api-contract.md](11-api-contract.md), [09-data-model.md](09-data-model.md), [12-ai-design.md](12-ai-design.md) |
| Building the screen | [06-ux-specification.md](06-ux-specification.md), [05-user-flows.md](05-user-flows.md) |
| Writing the demo | [28-demo-script.md](28-demo-script.md), [29-pitch.md](29-pitch.md), [30-judge-q-and-a.md](30-judge-q-and-a.md) |
| Checking a safety or privacy question | [14-safety-case.md](14-safety-case.md), [15-security-threat-model.md](15-security-threat-model.md), [16-privacy-governance-regulatory.md](16-privacy-governance-regulatory.md) |

## Product in one paragraph

ERgency turns a messy first emergency-department conversation into a structured triage evidence brief and a source-linked suggested review order. Every report remains openable. Information gaps and account cues only point at captured source text; they do not set a clinician priority, ATS category, next step, diagnosis, prescription, or disposition.

## Maturity lines

These four lines are never blurred. See [00-executive-summary.md](00-executive-summary.md).

1. **SaaSathon MVP** — synthetic voice-first tablet capture with an editable confirmation and written fallback, authenticated clinician review, provenance draft, approve.
2. **Post-hackathon prototype** — still synthetic or consented simulation, audio experiment, richer auth.
3. **Clinical pilot** — real patients only after governance this package does not claim to have.
4. **Production healthcare product** — regulated deployment this weekend does not attempt.

## Index

### Decision and product

- [00-executive-summary.md](00-executive-summary.md)
- [01-problem-and-market.md](01-problem-and-market.md)
- [02-competitive-landscape.md](02-competitive-landscape.md)
- [03-product-requirements.md](03-product-requirements.md)
- [04-mvp-scope.md](04-mvp-scope.md)
- [25-product-roadmap.md](25-product-roadmap.md)
- [32-cto-decision-summary.md](32-cto-decision-summary.md)
- [33-tablet-clinician-workflow.md](33-tablet-clinician-workflow.md)

### Experience

- [05-user-flows.md](05-user-flows.md)
- [06-ux-specification.md](06-ux-specification.md)
- [28-demo-script.md](28-demo-script.md)
- [29-pitch.md](29-pitch.md)
- [30-judge-q-and-a.md](30-judge-q-and-a.md)
- [31-readme.md](31-readme.md)

### Build

- [07-system-architecture-mvp.md](07-system-architecture-mvp.md)
- [08-system-architecture-production.md](08-system-architecture-production.md)
- [09-data-model.md](09-data-model.md)
- [10-triage-brief-schema.md](10-triage-brief-schema.md)
- [11-api-contract.md](11-api-contract.md)
- [12-ai-design.md](12-ai-design.md)
- [27-backlog.md](27-backlog.md)
- [ADRs](ADRs/ADR-001-provenance-not-scribe.md)

### Trust

- [13-provenance-and-trust.md](13-provenance-and-trust.md)
- [14-safety-case.md](14-safety-case.md)
- [15-security-threat-model.md](15-security-threat-model.md)
- [16-privacy-governance-regulatory.md](16-privacy-governance-regulatory.md)
- [17-interoperability.md](17-interoperability.md)
- [18-testing-strategy.md](18-testing-strategy.md)
- [19-observability.md](19-observability.md)

### Operate and learn

- [20-deployment-and-devops.md](20-deployment-and-devops.md)
- [21-cost-model.md](21-cost-model.md)
- [22-business-model.md](22-business-model.md)
- [23-validation-plan.md](23-validation-plan.md)
- [24-pilot-plan.md](24-pilot-plan.md)
- [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md)

## Architecture decision records

- [ADR-001 Provenance, not a scribe or triage assigner](ADRs/ADR-001-provenance-not-scribe.md)
- [ADR-002 Typed transcript is the demo path](ADRs/ADR-002-typed-transcript.md)
- [ADR-003 One Next.js app, no microservices](ADRs/ADR-003-single-next-app.md)
- [ADR-004 Plain fields now, standards later](ADRs/ADR-004-plain-fields.md)
- [ADR-005 Split AI steps, deterministic assembly](ADRs/ADR-005-split-ai-steps.md)
- [ADR-006 No numeric model confidence](ADRs/ADR-006-no-confidence-score.md)
- [ADR-007 One seeded clinician for the demo](ADRs/ADR-007-seeded-clinician.md)
- [ADR-008 Synthetic data only this weekend](ADRs/ADR-008-synthetic-only.md)
- [ADR-009 Tablet capture, clinician-only decision](ADRs/ADR-009-tablet-capture-clinician-decision.md)

## Names used everywhere

| Name | Meaning |
| --- | --- |
| ERgency | Product |
| Encounter | One synthetic presentation |
| Transcript | Voice-derived or typed text, confirmed by the person. Untrusted |
| Statement | One extracted claim with an epistemic status |
| Gap | One "Information to clarify" item. At most three shown |
| Highlight | An AI question or pointer to source text |
| Brief | The triage evidence brief JSON document |
| Review | Clinician edits plus approval |
| ATS record | Optional category the clinician types. The model cannot write it |

Epistemic status is exactly `EXPLICIT`, `UNCERTAIN`, `NEGATED`, `CONTRADICTED`, or `UNKNOWN`.

Source kind is exactly `PATIENT_REPORTED`, `STAFF_OBSERVED`, `CONTEXT_PROVIDED`, or `AI_HIGHLIGHTED`.

## Event clock

- Documentation baseline: Friday 25 Sep 2026 23:29 UTC = Saturday 26 Sep 2026 11:29 NZST (UTC+12).
- Execution plan starts Saturday 26 Sep 2026 12:00 NZST.
- Clocks jump forward at 02:00 NZST on Sunday 27 Sep 2026 to 03:00 NZDT.
- Hosted demo deadline: Sunday 27 Sep 2026 10:00 NZDT.
- Live event rules: [SaaSathon participant docs](https://www.saasathon.dev/docs). If those pages and this brief disagree, [32-cto-decision-summary.md](32-cto-decision-summary.md) records both and the tighter MVP scope wins.
