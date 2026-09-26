-- Separate the anonymous tablet hand-off from the authenticated clinical
-- workspace.  The public surface can submit a narrow, write-once record but
-- can never read a queue, a brief, or a clinician decision.

alter table public.encounters
  add column submission_source text not null default 'staff'
    check (submission_source in ('staff', 'tablet')),
  add column speech_used boolean not null default false,
  add constraint tablet_capture_has_no_staff_attribution check (
    submission_source <> 'tablet'
    or (recorded_by is null and recorded_by_label = '' and age_years is null and observed_signs = '')
  ),
  add constraint staff_capture_does_not_claim_speech check (
    submission_source = 'tablet' or speech_used = false
  );

-- Tablet submissions intentionally have no authenticated recorder. Existing
-- staff-captured rows keep their original accountability fields.
alter table public.encounters
  alter column recorded_by drop not null;

alter table public.triage_briefs
  alter column drafted_by drop not null;

create table public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  role text not null check (role in ('clinician', 'nurse', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_role_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check (role in ('clinician', 'nurse', 'admin')),
  changed_by uuid references auth.users(id) on delete restrict,
  changed_at timestamptz not null default now()
);

alter table public.staff_profiles enable row level security;
alter table public.staff_role_audit enable row level security;

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.staff_profiles where user_id = auth.uid()
$$;

create or replace function public.audit_staff_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.staff_role_audit (user_id, role, changed_by)
  values (new.user_id, new.role, auth.uid());
  new.updated_at := now();
  return new;
end;
$$;

create trigger staff_profiles_audit_role
before insert or update of role on public.staff_profiles
for each row execute function public.audit_staff_role();

-- New accounts begin as read-only nurses. Existing users are added below. The
-- first verified user can be promoted exactly once by the audited bootstrap
-- function; later role changes require an operator with database access.
create or replace function public.create_default_staff_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.staff_profiles (user_id, role)
  values (new.id, 'nurse')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger auth_user_default_staff_profile
after insert on auth.users
for each row execute function public.create_default_staff_profile();

insert into public.staff_profiles (user_id, role)
select id, 'nurse' from auth.users
on conflict (user_id) do nothing;

create or replace function public.bootstrap_first_clinician()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  caller uuid := auth.uid();
begin
  if caller is null then
    raise exception 'A signed-in staff account is required.' using errcode = 'insufficient_privilege';
  end if;

  perform pg_advisory_xact_lock(31926014);
  if exists (select 1 from public.staff_profiles where role = 'clinician') then
    return coalesce((select role from public.staff_profiles where user_id = caller), 'none');
  end if;

  insert into public.staff_profiles (user_id, role)
  values (caller, 'clinician')
  on conflict (user_id) do update set role = 'clinician';
  return 'clinician';
end;
$$;

-- Submit the encounter and the locked draft in one transaction. It is the only
-- anonymous writer; direct table INSERT is deliberately not granted to anon.
create or replace function public.capture_tablet_intake(
  patient_reference_input text,
  presenting_concern_input text,
  patient_account_input text,
  speech_used_input boolean,
  concern_summary_input text,
  items_to_check_input text,
  open_questions_input text,
  drafted_from_input text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  encounter_id uuid;
begin
  if char_length(btrim(patient_reference_input)) not between 1 and 64
    or char_length(btrim(presenting_concern_input)) not between 1 and 200
    or char_length(btrim(patient_account_input)) not between 1 and 4000
    or char_length(coalesce(concern_summary_input, '')) > 600
    or char_length(coalesce(items_to_check_input, '')) > 4000
    or char_length(coalesce(open_questions_input, '')) > 2000
    or drafted_from_input not in ('model-v1', 'deterministic-fallback-v1') then
    raise exception 'Invalid tablet intake.' using errcode = 'check_violation';
  end if;

  insert into public.encounters (
    patient_reference, presenting_concern, patient_account, observed_signs,
    recorded_by, recorded_by_label, submission_source, speech_used
  ) values (
    btrim(patient_reference_input), btrim(presenting_concern_input),
    btrim(patient_account_input), '', null, '', 'tablet', speech_used_input
  ) returning id into encounter_id;

  insert into public.triage_briefs (
    encounter_id, drafted_by, concern_summary, patient_reported,
    staff_observed, items_to_check, open_questions, drafted_from
  ) values (
    encounter_id, null, coalesce(concern_summary_input, ''),
    btrim(patient_account_input), '', coalesce(items_to_check_input, ''),
    coalesce(open_questions_input, ''), drafted_from_input
  );

  return encounter_id;
end;
$$;

-- Replace broad authenticated access with role-gated staff access. Capture
-- remains write-once: no UPDATE grant or policy is ever added for encounters.
drop policy if exists "Read the department queue" on public.encounters;
drop policy if exists "Open an encounter" on public.encounters;
drop policy if exists "Withdraw an encounter that has no brief" on public.encounters;
drop policy if exists "Read triage briefs" on public.triage_briefs;
drop policy if exists "Attach a drafted brief" on public.triage_briefs;
drop policy if exists "Revise or approve a draft brief" on public.triage_briefs;

revoke all on public.encounters from anon, authenticated;
revoke all on public.triage_briefs from anon, authenticated;
revoke all on public.staff_profiles from anon, authenticated;
revoke all on public.staff_role_audit from anon, authenticated;

grant select on public.encounters to authenticated;
grant select on public.triage_briefs to authenticated;
grant update (
  concern_summary, items_to_check, open_questions, clinician_notes,
  priority, next_step, status, reviewed_by, reviewed_by_label, approved_at
) on public.triage_briefs to authenticated;

create policy "Role-gated staff read encounters" on public.encounters
  for select to authenticated
  using (public.current_staff_role() in ('clinician', 'nurse', 'admin'));

create policy "Role-gated staff read briefs" on public.triage_briefs
  for select to authenticated
  using (public.current_staff_role() in ('clinician', 'nurse', 'admin'));

create policy "Clinicians revise or approve draft briefs" on public.triage_briefs
  for update to authenticated
  using (public.current_staff_role() = 'clinician' and status = 'draft')
  with check (public.current_staff_role() = 'clinician' and status in ('draft', 'approved'));

revoke all on function public.current_staff_role() from public;
revoke all on function public.bootstrap_first_clinician() from public;
revoke all on function public.capture_tablet_intake(text, text, text, boolean, text, text, text, text) from public;
grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.bootstrap_first_clinician() to authenticated;
grant execute on function public.capture_tablet_intake(text, text, text, boolean, text, text, text, text) to anon, authenticated;

revoke execute on function public.audit_staff_role() from public;
revoke execute on function public.create_default_staff_profile() from public;
