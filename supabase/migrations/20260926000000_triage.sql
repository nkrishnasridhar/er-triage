-- ER Triage: guided intake capture and clinician-reviewed triage briefs.
--
-- Guarantees enforced here rather than in application code (PRODUCT_GOAL.md):
--
--   * The application never assigns urgency. `priority` is clinician-supplied,
--     and the constraints below make it impossible to mark a brief approved
--     without a clinician's priority and next step attached to it.
--   * Approval is one-way. Enforced twice, deliberately: the UPDATE policy can
--     only see rows still in draft, and a trigger refuses to modify an approved
--     row for *any* role. RLS alone is not enough, because the table owner and
--     service_role both have BYPASSRLS and would otherwise slip past it.
--   * A captured intake is write-once. encounters has no UPDATE grant and no
--     UPDATE policy at all, so what was said and observed cannot be edited
--     after the moment it was recorded.
--   * Accountability survives the record. `recorded_by`, `drafted_by` and
--     `reviewed_by` are retained, and accounts referenced by a record cannot be
--     deleted out from under it.
--   * Patient identity is deliberately minimised. There is no name, no date of
--     birth and no contact detail, only the local patient reference the staff
--     member already holds.
--
-- The draft columns (items_to_check, open_questions) hold literal keyword
-- matches from lib/draft-brief.ts. They are prompts for a clinician to look at
-- something. They are not findings, not a severity assessment and not a
-- triage category.

-- The hosted hackathon project predates this feature and already has an
-- unrelated `encounters` table. Preserve it rather than overwriting its rows,
-- then create the intentionally different, minimal triage table below. A
-- schema that is neither the known legacy shape nor this migration's shape is
-- refused so an operator can inspect it before any change is made.
do $$
begin
  if to_regclass('public.encounters') is not null then
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'encounters'
        and column_name = 'owner_id'
    ) and not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'encounters'
        and column_name = 'patient_reference'
    ) then
      if to_regclass('public.legacy_encounters') is not null then
        raise exception
          'Cannot adopt legacy encounters: public.legacy_encounters already exists.';
      end if;

      alter table public.encounters rename to legacy_encounters;
    else
      raise exception
        'Cannot create triage encounters: public.encounters has an unexpected schema.';
    end if;
  end if;
end;
$$;

create table public.encounters (
  id uuid primary key default gen_random_uuid(),
  patient_reference text not null check (
    char_length(btrim(patient_reference)) between 1 and 64
  ),
  age_years smallint check (age_years between 0 and 130),
  presenting_concern text not null check (
    char_length(btrim(presenting_concern)) between 1 and 200
  ),
  patient_account text not null default '' check (char_length(patient_account) <= 4000),
  observed_signs text not null default '' check (char_length(observed_signs) <= 2000),
  recorded_by uuid not null references auth.users(id) on delete restrict,
  -- A readable snapshot of the account, so the record still names a person
  -- even if the account is later renamed.
  recorded_by_label text not null default '' check (char_length(recorded_by_label) <= 254),
  created_at timestamptz not null default now()
);

create table public.triage_briefs (
  id uuid primary key default gen_random_uuid(),
  encounter_id uuid not null unique references public.encounters(id) on delete cascade,
  drafted_by uuid not null references auth.users(id) on delete restrict,
  concern_summary text not null default '' check (char_length(concern_summary) <= 600),
  patient_reported text not null default '' check (char_length(patient_reported) <= 4000),
  staff_observed text not null default '' check (char_length(staff_observed) <= 2000),
  items_to_check text not null default '' check (char_length(items_to_check) <= 4000),
  open_questions text not null default '' check (char_length(open_questions) <= 2000),
  clinician_notes text not null default '' check (char_length(clinician_notes) <= 4000),
  priority text check (
    priority in ('immediate', 'very_urgent', 'urgent', 'standard', 'non_urgent')
  ),
  next_step text check (
    next_step in (
      'immediate_escalation',
      'priority_clinical_review',
      'standard_queue',
      'monitor_and_reassess',
      'discharge_with_advice'
    )
  ),
  status text not null default 'draft' check (status in ('draft', 'approved')),
  drafted_at timestamptz not null default now(),
  drafted_from text not null default 'local-rules-v1',
  reviewed_by uuid references auth.users(id) on delete restrict,
  reviewed_by_label text check (char_length(reviewed_by_label) <= 254),
  approved_at timestamptz,
  -- A decision cannot be recorded without the clinician who made it.
  constraint decisions_carry_a_reviewer check (
    (priority is null
      and next_step is null
      and reviewed_by is null
      and reviewed_by_label is null
      and approved_at is null)
    or (
      priority is not null
      and next_step is not null
      and reviewed_by is not null
      and reviewed_by_label is not null
      and approved_at is not null
    )
  ),
  -- And a brief cannot be approved without a decision.
  constraint approval_requires_a_decision check (
    status <> 'approved'
    or (priority is not null and next_step is not null and reviewed_by is not null and approved_at is not null)
  )
);

create index encounters_created_idx on public.encounters (created_at desc);
create index encounters_recorded_by_idx on public.encounters (recorded_by);
create index triage_briefs_status_idx on public.triage_briefs (status);

alter table public.encounters enable row level security;
alter table public.triage_briefs enable row level security;

revoke all on public.encounters from anon, authenticated;
revoke all on public.triage_briefs from anon, authenticated;

-- The department queue is shared, so any signed-in staff member reads every
-- encounter. There is no UPDATE grant for encounters: a captured intake is
-- write-once, by design.
grant select on public.encounters to authenticated;
grant insert on public.encounters to authenticated;
-- A narrow safety valve: the person who opened an encounter may withdraw it
-- while it has no brief attached, which is what a failed draft leaves behind.
-- Once a brief exists the encounter is part of the clinical record and this
-- policy no longer applies, so an approved record can never be deleted.
grant delete on public.encounters to authenticated;

grant select on public.triage_briefs to authenticated;
grant insert on public.triage_briefs to authenticated;
-- patient_reported and staff_observed are deliberately absent from this list.
-- They record what was said and what was seen, so they stay exactly as
-- captured and cannot be rewritten during review. The columns a reviewer may
-- change are the draft columns, their own notes, and their decision.
grant update (
  concern_summary,
  items_to_check,
  open_questions,
  clinician_notes,
  priority,
  next_step,
  status,
  reviewed_by,
  reviewed_by_label,
  approved_at
) on public.triage_briefs to authenticated;

create policy "Read the department queue" on public.encounters
  for select to authenticated using (true);

create policy "Open an encounter" on public.encounters
  for insert to authenticated with check ((select auth.uid()) = recorded_by);

create policy "Withdraw an encounter that has no brief" on public.encounters
  for delete to authenticated using (
    (select auth.uid()) = recorded_by
    and not exists (
      select 1 from public.triage_briefs where encounter_id = encounters.id
    )
  );

create policy "Read triage briefs" on public.triage_briefs
  for select to authenticated using (true);

-- A brief is always born a draft. Forcing status here means the only route to an
-- approved record is the UPDATE policy below, which requires the row to still be
-- a draft and so cannot be used to fabricate a sign-off.
create policy "Attach a drafted brief" on public.triage_briefs
  for insert to authenticated
  with check ((select auth.uid()) = drafted_by and status = 'draft');

-- Any signed-in clinician may work on a brief that is still in draft, which is
-- how a second pair of eyes picks it up. Once approved the row is outside the
-- reach of UPDATE, so the approved record cannot be quietly rewritten.
create policy "Revise or approve a draft brief" on public.triage_briefs
  for update to authenticated
  using (status = 'draft')
  with check (status in ('draft', 'approved'));

-- Second, unconditional layer for the same guarantee. RLS is bypassed by the
-- table owner and by service_role, so a policy alone does not make an approved
-- record immutable for every caller. This trigger does. draft -> approved is
-- allowed because the *old* row is still a draft.
create function public.triage_briefs_freeze_approved()
returns trigger
language plpgsql
as $$
begin
  if old.status = 'approved' then
    raise exception
      'Triage brief % is approved and cannot be modified.', old.id
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$$;

create trigger triage_briefs_freeze_approved
before update on public.triage_briefs
for each row execute function public.triage_briefs_freeze_approved();

revoke execute on function public.triage_briefs_freeze_approved() from public;

-- The starter's example table is not used by this product. Preserve it rather
-- than deleting a pre-existing table or any rows it may contain.
