-- The clinician-selected review form now uses four options:
-- immediate, urgent, soon, and non_urgent. Historical approved records can
-- contain the previous very_urgent or standard values, and must not be altered:
-- approval is immutable. They remain valid for display only; application
-- validation accepts only the four current choices for new approvals.

alter table public.triage_briefs
  drop constraint if exists triage_briefs_priority_check;

alter table public.triage_briefs
  add constraint triage_briefs_priority_check check (
    priority in (
      'immediate',
      'urgent',
      'soon',
      'non_urgent',
      'very_urgent',
      'standard'
    )
  );

-- This changes only the permitted value vocabulary. Existing RLS policies and
-- the restricted clinician UPDATE grant remain in force; in particular, no
-- UPDATE permission is added to the write-once encounters table.
