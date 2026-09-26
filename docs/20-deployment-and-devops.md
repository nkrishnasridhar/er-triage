# 20 — Deployment and DevOps

## Recommendation

Deploy the existing Vercel project connected to this GitHub repo. Use a Supabase project created for the hackathon, not a linked production database and not a hospital tenant. Apply the forward migrations there with the Supabase CLI or the SQL editor. Create the first clinician account. The primary tablet screen also needs a server-only OpenAI key with Realtime access; without it, the written check-in remains available but voice cannot start. Freeze at Sunday 09:00 NZDT.

SaaSathon's own docs say to deploy early because last-minute failures are deployment failures. The starter may already have a URL. Keep that URL alive while schema work happens.

## Checklist

### Saturday midday

- [ ] Confirm the branch `cursor/ed-triage-docs-d13e` is not where implementation will be mixed blindly. Implementation can continue on this branch or a follow-on branch. Do not force-push `main`.
- [ ] `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm build` on a clean checkout once before relying on CI.
- [ ] Vercel production env: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the deployed Supabase project. No Supabase service-role key belongs in this app.
- [ ] Vercel server-only env: `OPENAI_API_KEY` with Realtime access; optionally set `OPENAI_REALTIME_MODEL` (defaults to `gpt-realtime-2.1`). `OPENAI_MODEL` is optional—the deterministic composition fallback is used when it is absent. None of these keys are committed or prefixed `NEXT_PUBLIC_`.
- [ ] Supabase auth email/password is enabled and the first synthetic-demo staff account is created and able to sign in. Its first successful sign-in bootstraps the audited `clinician` role; later accounts are read-only until an operator provisions their role.
- [ ] Confirm the Supabase project is one the team created this weekend or an empty course project. Read `AGENTS.md`: never reset a linked or production database.

### Schema

- [ ] Apply the repository’s unapplied forward migrations with `supabase db push` or Supabase SQL Editor. Never run `supabase db reset` against the hosted project.
- [ ] RLS enabled, grants minimal, two-account test written.
- [ ] `synthetic` check constraint present.
- [ ] Forbidden-key check present if the team finished that SQL.

### App

- [ ] `/` starts voice-first check-in over HTTPS; microphone permission and speaker output work on the tablet. `/check-in` remains usable when microphone permission is denied or the Realtime service is unavailable.
- [ ] `/login` reaches the role-gated `/queue` after the synthetic clinician signs in.
- [ ] No `dangerouslySetInnerHTML` on transcript or brief text.
- [ ] The long-lived model key is server-only. The browser receives only a short-lived Realtime credential.

### Sunday before 07:30 NZDT

- [ ] Production deploy is the commit you rehearsed. Preview URLs are extra, not the judge link.
- [ ] Seed encounters exist for the demo user.
- [ ] Mara compose works on the hosted URL.
- [ ] Samir compose leaves ATS empty.
- [ ] Sign out and sign in again.

### Sunday 09:00 NZDT freeze

- [ ] No more features.
- [ ] Only a rollback or a one-line copy fix if the safety banner is wrong.
- [ ] Submission repo is public or `justus.huneke@luminpdf.com` / GitHub user `justus-lumin` is invited, per the event docs.
- [ ] Deployed URL is in the submission.
- [ ] README still does not contain secrets.

### Rollback

- [ ] Vercel instant rollback to the previous deployment is the plan. Do not debug schema on stage.
- [ ] If the migration was destructive, you violated the plan. Migrations this weekend are additive.

## CI

`.github/workflows/ci.yml` already exists. It should keep running lint, typecheck, test, and build. Do not require `OPENAI_API_KEY` in CI. Do not run `supabase db reset` against a remote database in CI.

## Environments

| Name | Purpose |
| --- | --- |
| Local Supabase | Development and integration tests. Docker |
| Vercel preview | Optional, per branch |
| Vercel production | Judge URL |
| Hosted Supabase | The demo database only |

One Supabase project is enough. Do not create a staging stack.

## Daylight saving

Build servers and GitHub use UTC. The deadline is 10:00 NZDT on Sunday 27 September 2026, which is 21:00 UTC on Saturday 26 September 2026 if NZDT is UTC+13. **Check that arithmetic on a phone set to automatic timezone before you rely on it.** The lost hour is local sleep, not a change to UTC timestamps in the database. Store `timestamptz`. Display `Pacific/Auckland`.

Verification of the UTC instant: NZDT is 13 hours ahead of UTC. 10:00 NZDT Sunday minus 13 hours is 21:00 UTC Saturday. The event's wall clock is what judges use. Phones with automatic timezone are the source of truth the event docs name.

## Secrets rotation

If a key appears in a commit, rotate it. Do not push a follow-up commit that "deletes the key" and leave the old key live. Git history would still contain it; rotation is the fix.

## What not to provision

Paid observability, a second model vendor, an SMS gateway, a custom domain unless it is free and already trivial, or any health-system agreement. `AGENTS.md` forbids provisioning paid services or extra production projects without the owner's approval. Event credits are the AI budget.
