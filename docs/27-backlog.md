# 27 — Backlog

> **Implementation update — 26 September 2026:** The tablet hand-off, role-gated workspace, server-only composition guard, and deterministic fallback are implemented. The remaining future work is governed by [33](33-tablet-clinician-workflow.md): do not turn any backlog queue-management item into AI urgency ranking.

Small tickets. Effort is relative: **S** a short block, **M** a half-day inside the weekend, **L** does not fit the critical path. Priority **P0** is must-build, **P1** should, **P2** cut first, **P3** post-MVP.

Owner type is a role from [26-hackathon-execution-plan.md](26-hackathon-execution-plan.md), not a person's name.

| ID | Title | Owner | Description | Acceptance | Dependency | Pri | Effort | When |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-001 | Add brief Zod schema | Model | `lib/encounters/schema.ts` as in doc 10, including clinician-added span exception from doc 11 | Unit test accepts the Mara example and rejects `recommendedAts` | None | P0 | S | MVP |
| T-002 | Fixtures file | Model | Mara, Jules, Samir transcripts and expected constraints | Imported by tests and seed | T-001 | P0 | S | MVP |
| T-003 | Assembler | Model | Pure function, gap cap 3, highlight templates, ATS copy-forward | FX-06, FX-08, FX-09 unit tests without network | T-001 | P0 | M | MVP |
| T-004 | Migration | Data | Tables, indexes, checks, grants, RLS | Local `db reset` on the **local** stack only; ideas table remains | None | P0 | M | MVP |
| T-005 | Two-account test | QA | User B cannot read user A's encounter | Integration script or written manual result | T-004 | P0 | S | MVP |
| T-006 | Create encounter action | Data | Zod, owner from session, synthetic true | Invalid name rejected; row owned by session | T-004 | P0 | S | MVP |
| T-007 | Save transcript action | Data | Length cap, upsert | Empty compose does not call model | T-006 | P0 | S | MVP |
| T-008 | Extract call | Model | System prompt constant, untrusted sentinel, JSON parse | Timeout returns `MODEL_TIMEOUT` and no row | T-001 | P0 | M | MVP |
| T-009 | Gap call | Model | Max three, blocklist | Five gaps become three | T-008 | P0 | S | MVP |
| T-010 | Compose action | Data | Wires extract, gaps, assemble, revision insert | Failed Zod leaves previous brief | T-003, T-007, T-008 | P0 | M | MVP |
| T-011 | Encounter list page | Frontend | Status words, no acuity sort, copy C12 | Empty and populated states | T-006 | P0 | S | MVP |
| T-012 | Transcript page | Frontend | Copy C7 and C8, save then compose | Too-long message | T-007 | P0 | S | MVP |
| T-013 | Review page | Frontend | Sections in doc 06 order, disclaimer C2 | Uncertain allergy is not a bare chip | T-010 | P0 | M | MVP |
| T-014 | ATS control | Frontend | Empty select, posts `recordAts` only | Compose response does not change it | T-013 | P0 | S | MVP |
| T-015 | Edit statement | Frontend | One statement form | Revision row `source=edit` | T-013 | P0 | S | MVP |
| T-016 | Approve and handover | Frontend | Copy C9 and C10 | Open gaps do not block | T-013 | P0 | S | MVP |
| T-017 | Seed script | Deploy | Env password, three encounters, no committed secret | Re-run does not duplicate | T-004, T-002 | P0 | S | MVP |
| T-018 | Hide signup on demo | Frontend | Login screen matches doc 06 | Judge is not asked to create an account | None | P0 | S | MVP |
| T-019 | Redirect after login | Frontend | Lands on `/encounters` | Ideas route still exists | T-011 | P0 | S | MVP |
| T-020 | Samir live check | QA | Hosted compose | ATS null, no ATS highlight | T-010, T-017 | P0 | S | MVP |
| T-021 | Log redaction | Data | No transcript in `console` | Grep the actions for `console.log` of body | T-010 | P0 | S | MVP |
| T-022 | Button disables during compose | Frontend | No double revision from a double click | Second click does nothing while pending | T-010 | P1 | S | MVP |
| T-023 | Dismiss highlight | Frontend | Hides on handover | Audit row | T-013 | P1 | S | Should |
| T-024 | Dismiss gap | Frontend | Removes one gap | Approve still works | T-013 | P1 | S | Should |
| T-025 | Add observation | Frontend | Label "Added by clinician" | Zero-span exception only for this path | T-015 | P1 | S | Should |
| T-026 | Amend after approval | Data | New revision, clears approval | Frozen if not built | T-016 | P1 | M | Should |
| T-027 | Note a clarification | Frontend | Appends to context, does not invent a patient statement | Visible as context | T-012 | P1 | S | Should |
| T-028 | Print stylesheet | Frontend | Handover readable in print preview | Screen path still fine | T-016 | P2 | S | Cut first |
| T-029 | Microphone | Frontend | Not started | Flag default off if a spike exists | None | P2 | L | Cut first |
| T-030 | Streaming tokens | Model | Not started | n/a | T-008 | P2 | M | Cut first |
| T-031 | Third summary call | Model | Do not add | n/a | None | P2 | M | Cut first |
| T-032 | RBAC roles | Data | Post-hackathon design only | n/a | None | P3 | L | Post |
| T-033 | FHIR export | Data | Do not add a library this weekend | n/a | None | P3 | L | Post |
| T-034 | NHI column | Data | Do not add | n/a | None | P3 | S | Post |
| T-035 | SNOMED bind | Model | Do not add | n/a | None | P3 | L | Post |
| T-036 | Live eval script | QA | Checklist output, skips without key | Not in CI | T-008 | P1 | S | MVP if time, else manual |
| T-037 | Rehearsal | Pitch | Two timed runs on the host | Under 5:00 | T-020 | P0 | S | MVP |
| T-038 | Submission pack | Deploy | Repo visibility and URL | Matches event rule | T-020 | P0 | S | MVP |
| T-039 | Unsafe-badge ban | Safety | Review PR diff for "risk score", "AI recommends", red ATS | No matches in UI | T-013 | P0 | S | MVP |
| T-040 | Context note on create | Frontend | Optional field, source kind later | Stored, max 1000 | T-006 | P0 | S | MVP |

P0 count is intentionally the demo. If a P0 is still open at Saturday 21:00, drop a P1 before dropping T-014 or T-020.
