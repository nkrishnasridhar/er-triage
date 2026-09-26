-- ERgency synthetic demonstration reset
--
-- Run manually in the Supabase SQL Editor for the dedicated hackathon/demo
-- project only. This script permanently deletes every row in public.encounters
-- and public.triage_briefs before loading its fictional fixture data. It does
-- not alter staff accounts, roles, or role-audit history.
--
-- Before running, replace BOTH placeholders below:
--   1. __TYPE_ERGENCY_DEMO_RESET__ with ERGENCY_DEMO_RESET
--   2. __DEMO_CLINICIAN_EMAIL__ with the email address of the account that
--      will present the demo. That account must already have clinician role.
--
-- Do not use this in a healthcare, patient, or mixed-data database.

begin;

select set_config(
  'app.ergency_demo_reset_confirmation',
  '__TYPE_ERGENCY_DEMO_RESET__',
  true
);
select set_config(
  'app.ergency_demo_reviewer_email',
  '__DEMO_CLINICIAN_EMAIL__',
  true
);

do $$
declare
  reviewer_count integer;
begin
  if current_setting('app.ergency_demo_reset_confirmation', true) <> 'ERGENCY_DEMO_RESET' then
    raise exception 'Demo reset not confirmed. Replace the confirmation placeholder before running this script.';
  end if;

  select count(*)
  into reviewer_count
  from public.staff_profiles profiles
  join auth.users users on users.id = profiles.user_id
  where profiles.role = 'clinician'
    and lower(users.email) = lower(current_setting('app.ergency_demo_reviewer_email', true));

  if reviewer_count <> 1 then
    raise exception 'The configured demo reviewer must be an existing clinician account.';
  end if;
end;
$$;

create temporary table demo_fixtures (
  id uuid primary key,
  patient_reference text not null,
  presenting_concern text not null,
  patient_account text not null,
  concern_summary text not null,
  items_to_check text not null,
  open_questions text not null,
  clinician_notes text not null,
  created_at timestamptz not null,
  status text not null,
  priority text,
  next_step text,
  approved_at timestamptz
) on commit drop;

-- Every person and account below is fictional. The approved rows contain a
-- pre-recorded demonstration decision by the configured clinician; they are
-- not recommendations, diagnoses, or system-assigned priority.
insert into demo_fixtures values
  ('10000000-0000-0000-0000-000000000001', 'DEMO-AR-001', 'Recurring dizziness', 'Fictional person reports feeling dizzy on and off since yesterday. They are unsure what makes it better or worse.', 'Dizziness reported since yesterday.', '- Patient reported: "dizzy on and off" — recorded in the account.', 'What was happening when this started?', 'Fictional demonstration review completed.', '2026-09-25 08:10:00+12', 'approved', 'urgent', 'priority_clinical_review', '2026-09-25 08:26:00+12'),
  ('10000000-0000-0000-0000-000000000002', 'DEMO-AR-002', 'Wrist pain after a fall', 'Fictional person says they tripped on a step this morning and their wrist has been painful since.', 'Wrist pain after a reported fall.', '- Patient reported: "tripped on a step" — recorded in the account.', 'Can you describe where the pain is strongest?', 'Fictional demonstration review completed.', '2026-09-25 08:42:00+12', 'approved', 'standard', 'standard_queue', '2026-09-25 09:02:00+12'),
  ('10000000-0000-0000-0000-000000000003', 'DEMO-AR-003', 'Breathing feels different while walking', 'Fictional person reports that breathing felt different while walking to the bus stop. They cannot say when it first started.', 'Change in breathing reported while walking.', '- Patient reported: "breathing felt different" — recorded in the account.', 'Is this happening now?', 'Fictional demonstration review completed.', '2026-09-25 09:18:00+12', 'approved', 'very_urgent', 'priority_clinical_review', '2026-09-25 09:24:00+12'),
  ('10000000-0000-0000-0000-000000000004', 'DEMO-AR-004', 'Fever and sore throat', 'Fictional person reports feeling hot, having a sore throat, and drinking less than usual since last night.', 'Fever and throat discomfort reported.', '- Patient reported: "drinking less than usual" — recorded in the account.', 'Have you been able to keep fluids down?', 'Fictional demonstration review completed.', '2026-09-25 10:05:00+12', 'approved', 'standard', 'monitor_and_reassess', '2026-09-25 10:29:00+12'),
  ('10000000-0000-0000-0000-000000000005', 'DEMO-AR-005', 'Nausea and abdominal discomfort', 'Fictional person reports nausea and abdominal discomfort since lunchtime. They are not sure what they ate beforehand.', 'Nausea and abdominal discomfort reported.', '- Patient reported: "since lunchtime" — recorded in the account.', 'Where is the discomfort located?', 'Fictional demonstration review completed.', '2026-09-25 11:12:00+12', 'approved', 'urgent', 'priority_clinical_review', '2026-09-25 11:35:00+12'),
  ('10000000-0000-0000-0000-000000000006', 'DEMO-AR-006', 'Eye irritation', 'Fictional person says one eye became irritated after gardening. They have not put anything in the eye.', 'Eye irritation after gardening reported.', '- Patient reported: "after gardening" — recorded in the account.', 'Was there a splash or foreign material near the eye?', 'Fictional demonstration review completed.', '2026-09-25 12:08:00+12', 'approved', 'non_urgent', 'standard_queue', '2026-09-25 12:31:00+12'),
  ('10000000-0000-0000-0000-000000000007', 'DEMO-AR-007', 'Question about a medicine', 'Fictional person wants to ask about a medicine they started recently. They brought the medicine packaging with them.', 'Question about a recently started medicine.', '- Patient reported: "started recently" — recorded in the account.', 'What is the medicine name on the packaging?', 'Fictional demonstration review completed.', '2026-09-25 13:20:00+12', 'approved', 'standard', 'standard_queue', '2026-09-25 13:42:00+12'),
  ('10000000-0000-0000-0000-000000000008', 'DEMO-AR-008', 'Persistent cough', 'Fictional person reports a cough that has continued for several days and says it is interrupting sleep.', 'Cough reported over several days.', '- Patient reported: "interrupting sleep" — recorded in the account.', 'When did the cough first begin?', 'Fictional demonstration review completed.', '2026-09-25 14:05:00+12', 'approved', 'standard', 'monitor_and_reassess', '2026-09-25 14:26:00+12'),
  ('10000000-0000-0000-0000-000000000009', 'DEMO-Q-001', 'New ankle pain', 'Fictional person says their ankle became painful after stepping off a curb. They can still describe what happened.', 'Ankle pain after stepping off a curb.', '- Patient reported: "after stepping off a curb" — recorded in the account.', 'When did this happen?', '', '2026-09-26 08:14:00+12', 'draft', null, null, null),
  ('10000000-0000-0000-0000-000000000010', 'DEMO-Q-002', 'Headache since waking', 'Fictional person reports a headache since waking up. They have not identified anything that changes it.', 'Headache reported since waking.', '- Patient reported: "since waking up" — recorded in the account.', 'What does the headache feel like to you?', '', '2026-09-26 08:27:00+12', 'draft', null, null, null),
  ('10000000-0000-0000-0000-000000000011', 'DEMO-Q-003', 'Hand cut while cooking', 'Fictional person says they cut their hand while preparing food. They covered it with a clean cloth before arriving.', 'Hand cut while preparing food.', '- Patient reported: "covered it with a clean cloth" — recorded in the account.', 'When did the cut happen?', '', '2026-09-26 08:41:00+12', 'draft', null, null, null),
  ('10000000-0000-0000-0000-000000000012', 'DEMO-Q-004', 'Back pain after lifting', 'Fictional person reports back pain after lifting a box at home. They are unsure whether the pain has changed since.', 'Back pain after lifting a box.', '- Patient reported: "after lifting a box" — recorded in the account.', 'Where is the pain located?', '', '2026-09-26 08:55:00+12', 'draft', null, null, null),
  ('10000000-0000-0000-0000-000000000013', 'DEMO-Q-005', 'Rash noticed this morning', 'Fictional person noticed a rash this morning and says it feels itchy. They have not tried any treatment.', 'Itchy rash noticed this morning.', '- Patient reported: "feels itchy" — recorded in the account.', 'Where did you first notice the rash?', '', '2026-09-26 09:09:00+12', 'draft', null, null, null),
  ('10000000-0000-0000-0000-000000000014', 'DEMO-Q-006', 'Feeling shaky', 'Fictional person says they have felt shaky since arriving at work. They are not sure what brought it on.', 'Feeling shaky reported after arriving at work.', '- Patient reported: "since arriving at work" — recorded in the account.', 'Are you feeling shaky right now?', '', '2026-09-26 09:23:00+12', 'draft', null, null, null);

-- Explicitly delete the dependent table first. This is intentional and is the
-- only destructive part of the script; staff accounts and audit rows remain.
delete from public.triage_briefs;
delete from public.encounters;

insert into public.encounters (
  id, patient_reference, presenting_concern, patient_account, observed_signs,
  recorded_by, recorded_by_label, submission_source, speech_used, created_at
)
select
  id, patient_reference, presenting_concern, patient_account, '', null, '',
  'tablet', false, created_at
from demo_fixtures;

insert into public.triage_briefs (
  encounter_id, drafted_by, concern_summary, patient_reported, staff_observed,
  items_to_check, open_questions, clinician_notes, priority, next_step, status,
  drafted_at, drafted_from, reviewed_by, reviewed_by_label, approved_at
)
select
  fixtures.id,
  null,
  fixtures.concern_summary,
  fixtures.patient_account,
  '',
  fixtures.items_to_check,
  fixtures.open_questions,
  fixtures.clinician_notes,
  fixtures.priority,
  fixtures.next_step,
  fixtures.status,
  fixtures.created_at + interval '1 minute',
  'deterministic-fallback-v1',
  case when fixtures.status = 'approved' then reviewer.id end,
  case when fixtures.status = 'approved' then reviewer.email end,
  fixtures.approved_at
from demo_fixtures fixtures
cross join lateral (
  select users.id, users.email
  from public.staff_profiles profiles
  join auth.users users on users.id = profiles.user_id
  where profiles.role = 'clinician'
    and lower(users.email) = lower(current_setting('app.ergency_demo_reviewer_email', true))
) reviewer;

do $$
declare
  encounter_count integer;
  approved_count integer;
begin
  select count(*) into encounter_count from public.encounters;
  select count(*) into approved_count from public.triage_briefs where status = 'approved';

  if encounter_count <> 14 or approved_count <> 8 then
    raise exception 'Demo reset verification failed: expected 14 encounters and 8 approved records, got % and %.', encounter_count, approved_count;
  end if;
end;
$$;

commit;
