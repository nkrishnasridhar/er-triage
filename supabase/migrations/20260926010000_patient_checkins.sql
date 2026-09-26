-- Patient tablet check-ins are deliberately separate from clinician-created
-- encounters. A person can submit a first account without an account, but
-- only authenticated staff can read it and turn it into a clinical brief.
-- The table is write-once: there is no UPDATE or DELETE grant for either
-- anonymous visitors or staff.

create table public.patient_checkins (
  id uuid primary key default gen_random_uuid(),
  check_in_code text not null unique check (
    check_in_code ~ '^CHK-[A-F0-9]{4}$'
  ),
  presenting_concern text not null check (
    char_length(btrim(presenting_concern)) between 1 and 200
  ),
  answers jsonb not null check (jsonb_typeof(answers) = 'array'),
  patient_account text not null check (char_length(patient_account) <= 4000),
  created_at timestamptz not null default now()
);

-- An encounter may be created from a tablet check-in once, and only once.
-- Existing staff-entered encounters keep a null reference.
alter table public.encounters
  add column patient_checkin_id uuid unique references public.patient_checkins(id) on delete restrict;

create index patient_checkins_created_idx on public.patient_checkins (created_at desc);

alter table public.patient_checkins enable row level security;
revoke all on public.patient_checkins from anon, authenticated;

-- The public tablet only needs to submit. It never reads its own or anyone
-- else's check-in, so an accidental tablet refresh cannot reveal a record.
grant insert on public.patient_checkins to anon, authenticated;
grant select on public.patient_checkins to authenticated;

create policy "Submit a patient check-in" on public.patient_checkins
  for insert to anon, authenticated with check (true);

create policy "Read patient check-ins as department staff" on public.patient_checkins
  for select to authenticated using (true);
