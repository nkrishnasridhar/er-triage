-- One source-linked suggestion per captured report. It influences the starting
-- display order only; it is deliberately separate from a clinician's priority
-- and next-step decision on triage_briefs.
create table public.review_suggestions (
  encounter_id uuid primary key references public.encounters(id) on delete cascade,
  attention_band text not null default 'unassessed' check (
    attention_band in (
      'suggested_first', 'suggested_next', 'suggested_later', 'suggested_last', 'unassessed'
    )
  ),
  information_gap_score smallint not null default 0 check (information_gap_score between 0 and 3),
  account_cue_score smallint not null default 0 check (account_cue_score between 0 and 3),
  rank_score smallint not null default -1 check (rank_score between -1 and 9),
  reasons jsonb not null default '[]'::jsonb,
  source text not null default 'unassessed' check (source in ('model-v1', 'unassessed')),
  model_version text check (char_length(model_version) between 1 and 254),
  assessed_at timestamptz not null default now(),
  constraint review_suggestions_reasons_are_short_array check (
    case
      when jsonb_typeof(reasons) = 'array' then jsonb_array_length(reasons) <= 6
      else false
    end
  ),
  constraint review_suggestions_consistent_score check (
    (
      source = 'unassessed'
      and attention_band = 'unassessed'
      and information_gap_score = 0
      and account_cue_score = 0
      and rank_score = -1
      and reasons = '[]'::jsonb
      and model_version is null
    )
    or (
      source = 'model-v1'
      and model_version is not null
      and rank_score = information_gap_score * 2 + account_cue_score
      and (
        (rank_score >= 6 and attention_band = 'suggested_first')
        or (rank_score between 4 and 5 and attention_band = 'suggested_next')
        or (rank_score between 2 and 3 and attention_band = 'suggested_later')
        or (rank_score between 0 and 1 and attention_band = 'suggested_last')
      )
    )
  )
);

create index review_suggestions_order_idx
  on public.review_suggestions (rank_score desc, assessed_at asc);

alter table public.review_suggestions enable row level security;
revoke all on public.review_suggestions from anon, authenticated;
grant select on public.review_suggestions to authenticated;

create policy "Role-gated staff read review suggestions" on public.review_suggestions
  for select to authenticated
  using (public.current_staff_role() in ('clinician', 'nurse', 'admin'));

-- A model result may replace the unassessed placeholder once. Afterwards the
-- recommendation is immutable, including to service_role callers.
create function public.review_suggestions_freeze_after_assessment()
returns trigger
language plpgsql
as $$
begin
  if old.encounter_id <> new.encounter_id
    or old.assessed_at <> new.assessed_at then
    raise exception 'A review suggestion identity cannot be changed.' using errcode = 'restrict_violation';
  end if;

  if old.source <> 'unassessed' or new.source = 'unassessed' then
    raise exception 'Review suggestion % is immutable after assessment.', old.encounter_id
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$$;

create trigger review_suggestions_freeze_after_assessment
before update on public.review_suggestions
for each row execute function public.review_suggestions_freeze_after_assessment();

revoke execute on function public.review_suggestions_freeze_after_assessment() from public;

-- The anonymous capture RPC creates the safe fallback row in the same
-- transaction as the immutable intake and draft. A server-only client may
-- replace it once with a validated model result.
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

  insert into public.review_suggestions (encounter_id)
  values (encounter_id);

  return encounter_id;
end;
$$;

revoke all on function public.capture_tablet_intake(text, text, text, boolean, text, text, text, text) from public;
grant execute on function public.capture_tablet_intake(text, text, text, boolean, text, text, text, text) to anon, authenticated;
