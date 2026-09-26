-- Public inserts bypass application validation, so bound the JSON payload in
-- the database as well. The Server Action performs the stricter question-id
-- and per-answer validation before an ordinary tablet submission is stored.
alter table public.patient_checkins
  add constraint patient_checkins_answers_bounded check (
    jsonb_array_length(answers) between 1 and 6
    and octet_length(answers::text) <= 6000
  );
