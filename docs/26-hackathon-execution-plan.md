# 26 — Hackathon execution plan

## Clock

| Instant | Local | Notes |
| --- | --- | --- |
| Now, as specified | Saturday 26 Sep 2026 11:29 NZST | UTC+12. This plan starts at 12:00 |
| Plan start | Saturday 26 Sep 2026 12:00 NZST | Workshops on the public schedule run until 14:00. One person may still be in a room. The build does not wait |
| Dinner | Saturday 18:00 NZST | Event schedule: Bacon Bros. Eat. Do not skip food to code |
| Lights out | Saturday 23:30 NZST | Phone timezone automatic |
| DST jump | Sunday 27 Sep 2026 02:00 NZST becomes 03:00 NZDT | One hour of clock time disappears. It is not a bonus hour |
| Wake | Sunday 06:30 NZDT | About six hours after 23:30 NZST, because 23:30–02:00 is 2.5 hours and 03:00–06:30 is 3.5 hours |
| Internal hosted deadline | Sunday 07:30 NZDT | Judge path works |
| Feature freeze | Sunday 09:00 NZDT | |
| Event deadline | Sunday 10:00 NZDT | Hosted product. Pitching starts 11:00 on the published schedule |

Elapsed time from Saturday 12:00 NZST to Sunday 10:00 NZDT is **21 hours**, not 22. Sleep takes about 6 of those. Build time is about 15 hours including dinner. Plan for 11 hours of focused build.

Set every phone to automatic time. The event docs say the same thing: daylight saving starts at 2am and the 10:00 deadline is wall-clock.

UTC check: 10:00 NZDT is 21:00 UTC on Saturday 26 Sep 2026, if NZDT is UTC+13. Confirm on a device before anyone uses a UTC cron. The deadline that matters is 10:00 on the wall in Christchurch.

## Roles (4–8 people)

| Role | Owns | If you have only four people |
| --- | --- | --- |
| Safety and product | Copy, schema fidelity, demo script, veto on ATS-from-model | Combined with pitch |
| Frontend | Review, transcript, handover, starter tokens | Combined with product |
| Data and actions | Migration, RLS, server actions | One person |
| Model | Prompts, assembler, fixtures | One person |
| Pitch | Five-minute script, Q&A sheet | Safety person |
| QA | Fixture checklist, second browser | Frontend, after 21:00 |
| Deploy | Vercel, Supabase, secrets | Data person |
| Float | Cuts scope, fetches food, watches the clock | Anyone not on the critical path |

Names go on a whiteboard. One person is the clock. They call cuts. They do not also own the model.

## Critical path

```text
schema lock → migration + RLS → save transcript → extract + assemble
→ review screen shows Mara's uncertainty → hosted deploy of that path
→ Samir injection on the host → rehearsal
```

Everything else is parallel or cuttable.

## Hour by hour

Times are local wall time.

| When | Block | Class |
| --- | --- | --- |
| Sat 12:00–13:00 | Read [32-cto-decision-summary.md](32-cto-decision-summary.md) and [04-mvp-scope.md](04-mvp-scope.md). Assign roles. Confirm the existing Vercel URL still loads. Create the demo Supabase project if missing. Put secrets in the host, not git | CRITICAL PATH |
| Sat 13:00–14:00 | Lock `1.0.0-mvp` schema and Zod. Add fixtures FX-01 to FX-03. One person may still be at a workshop; they join at 14:00 without a recap meeting | CRITICAL PATH |
| Sat 14:00–16:00 | Migration, grants, RLS, encounter create, transcript save. Home redirects toward encounters. Two-account test sketched | CRITICAL PATH |
| Sat 16:00 | **Hard internal deadline: schema frozen.** No new fields after this | CRITICAL PATH |
| Sat 16:00–18:00 | Extract prompt, gap prompt, assembler, compose action. Review page can be ugly if the sections exist | CRITICAL PATH |
| Sat 18:00–18:40 | Dinner | REQUIRED |
| Sat 18:40–21:00 | Provenance sections, gap list max three, ATS control empty, edit one statement, approve, handover | CRITICAL PATH |
| Sat 21:00 | **Hard internal deadline: Mara works on localhost** including uncertain allergy and empty ATS | CRITICAL PATH |
| Sat 21:00–23:00 | Deploy that build. Seed user. Run Mara on the host. Samir locally. Copy pass against the UX strings. Fix only blockers | CRITICAL PATH |
| Sat 23:00–23:30 | Stop. Write the three demo clicks on paper. Commit. If the host is red, the deploy owner stays until 00:00 only for rollback or env vars, not for features | CRITICAL PATH |
| Sat 23:30 | **Lights out.** Alarms for 06:30 NZDT, automatic timezone | REQUIRED |
| Sun 02:00 → 03:00 | Clocks change. Do not wake up for it | REQUIRED |
| Sun 06:30–07:30 | Hosted Mara and Samir. RLS spot check. `pnpm` checks if a code fix landed | CRITICAL PATH |
| Sun 07:30 | **Hard internal deadline: judge URL works** | CRITICAL PATH |
| Sun 07:30–09:00 | Two timed rehearsals of [28-demo-script.md](28-demo-script.md). Pitch person writes answers from [30-judge-q-and-a.md](30-judge-q-and-a.md) onto one page | PARALLEL |
| Sun 09:00 | **Feature freeze** | CRITICAL PATH |
| Sun 09:00–09:40 | Submission fields: public repo or invite `justus-lumin` / `justus.huneke@luminpdf.com`, live URL, team names. Event docs say submissions open Sunday morning | CRITICAL PATH |
| Sun 09:40–10:00 | Buffer. No deploys unless the site is down | CRITICAL PATH |
| Sun 10:00 | Deadline | |
| Sun 11:00 | Pitching begins on the published schedule. Be early. Five minutes plus three of questions | |

## Parallel, not blocking

- Pitch slides, if any. One slide is enough. The product is the demo.
- Print stylesheet.
- Dismiss-highlight polish.
- Reading Heidi's blog so the Q&A is accurate.
- Mario Kart at 19:30 is optional and is the first social cut. Go only if the 21:00 deadline is already met, which it will not be at 19:30. So the team does not go.

## Cut if late

Apply in order the moment a hard deadline is missed.

1. Microphone, streaming, animations.
2. Amend after approval.
3. Add-observation button. Nurse edits text instead.
4. Live gap-answer re-compose. Gaps can sit unanswered.
5. Extra seed encounter.
6. Any copy not in the UX spec.
7. If 21:00 fails: drop edit, keep compose, empty ATS, approve. A read-only review that is epistemically correct beats a broken editor.
8. If the host fails at 07:30: roll back to the last hosted commit that composed Mara. Do not rewrite prompts at 08:30.
9. If the model is down: the fallback demo is the assembler's fixture JSON rendered through the same UI, clearly introduced as a recorded compose because the provider is down. Try the live call once more before judging. Do not pretend a fixture was live. Judges were promised a working product; a labelled fallback is a damage control, not the plan.

## WIP limits

Two features in progress. Schema and UI can proceed together only after the Zod types exist. No third experiment.

## Definition of done for the weekend

The win condition in [00-executive-summary.md](00-executive-summary.md): a judge, on the hosted URL, sees Mara's penicillin line stay uncertain, sees a denial stay negated, sees at most three non-blocking clarifications, sees a highlight quote its source, and sees ATS empty until a human touches it.
