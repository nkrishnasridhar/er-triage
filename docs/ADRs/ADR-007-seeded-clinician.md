# ADR-007: One seeded clinician session

## Status

Accepted for the SaaSathon MVP.

## Context

Judges have five minutes. Signup, email verification, and role matrices will fail on stage. The starter already has Supabase auth and row-level security patterns. Real RBAC belongs with a health-system identity provider.

## Decision

The demo signs in as one seed user (`DEMO_CLINICIAN_EMAIL` / password in the host environment only). Email and password, not a magic link. Signup is hidden. RLS still keys off `auth.uid()` so a second account cannot read the rows. Roles (nurse, auditor, admin) are post-hackathon.

## Alternatives

- Public anonymous demo. Rejected: teaches the wrong habit and complicates RLS.
- Full RBAC now. Rejected: no second real role exists in the script.
- Magic link. Rejected: inbox dependency on stage.

## Consequences

The password must not be committed or put on a slide. A leaked password is rotated, not "removed in a later commit" while still valid. The two-account test is still required by `AGENTS.md` even though the demo uses one user.
