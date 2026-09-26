-- A fictional, optional device-reported measurement for the hackathon demo.
--
-- This belongs on the immutable encounter, not in a new table: it is a
-- timestamped part of the original capture and must never be interpreted as a
-- clinical decision. The only allowed provenance is `simulated`, so no live
-- wearable or patient data can be represented by this demonstration schema.
-- Existing encounter grants and RLS deliberately remain unchanged: staff can
-- read the value, while no role is granted UPDATE access to encounters.

alter table public.encounters
  add column device_snapshot_heart_rate_bpm smallint,
  add column device_snapshot_captured_at timestamptz,
  add column device_snapshot_source text,
  add constraint device_snapshot_is_complete_and_simulated check (
    (
      device_snapshot_heart_rate_bpm is null
      and device_snapshot_captured_at is null
      and device_snapshot_source is null
    )
    or (
      device_snapshot_heart_rate_bpm between 20 and 250
      and device_snapshot_captured_at is not null
      and device_snapshot_source = 'simulated'
    )
  );
