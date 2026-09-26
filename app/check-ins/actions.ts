"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { buildDraftBrief, DRAFT_SOURCE } from "@/lib/draft-brief";
import { requireUser } from "@/lib/auth";
import {
  patientAccountFromAnswers,
  safePatientCheckInAnswers,
} from "@/lib/patient-check-in";
import { encounterSchema, idSchema, type FormState } from "@/lib/validation";

function optionalAge(raw: FormDataEntryValue | null) {
  if (raw === null) return undefined;
  const trimmed = String(raw).trim();
  if (!trimmed) return undefined;
  return Number(trimmed);
}

/**
 * Authenticated staff turn an anonymous tablet submission into the existing
 * clinician-review workflow. The patient check-in itself stays write-once.
 */
export async function preparePatientCheckIn(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const { supabase, userId, email } = await requireUser();
  const checkInId = idSchema.safeParse(form.get("check_in_id"));
  if (!checkInId.success) return { error: "That patient check-in could not be found." };

  const staffInput = encounterSchema.safeParse({
    patient_reference: form.get("patient_reference"),
    age_years: optionalAge(form.get("age_years")),
    presenting_concern: form.get("presenting_concern"),
  });
  if (!staffInput.success) return { error: staffInput.error.issues[0].message };

  const { data: checkIn, error: checkInError } = await supabase
    .from("patient_checkins")
    .select("id, answers")
    .eq("id", checkInId.data)
    .maybeSingle();
  if (checkInError || !checkIn)
    return { error: "That patient check-in could not be found." };

  const answers = safePatientCheckInAnswers(checkIn.answers);
  if (!answers.success)
    return { error: "This patient check-in is incomplete. Record a staff intake instead." };

  const { data: existing } = await supabase
    .from("encounters")
    .select("id")
    .eq("patient_checkin_id", checkIn.id)
    .maybeSingle();
  if (existing) return { error: "This check-in has already been prepared for review." };

  const patientAccount = patientAccountFromAnswers(answers.data);
  const draft = buildDraftBrief({
    presentingConcern: staffInput.data.presenting_concern,
    patientAccount,
    observedSigns: "",
  });

  const { data: encounter, error: encounterError } = await supabase
    .from("encounters")
    .insert({
      patient_checkin_id: checkIn.id,
      patient_reference: staffInput.data.patient_reference,
      age_years: staffInput.data.age_years ?? null,
      presenting_concern: staffInput.data.presenting_concern,
      patient_account: patientAccount,
      observed_signs: "",
      recorded_by: userId,
      recorded_by_label: email,
    })
    .select("id")
    .single();
  if (encounterError || !encounter)
    return { error: "Couldn’t prepare this check-in. Try again." };

  const { error: briefError } = await supabase.from("triage_briefs").insert({
    encounter_id: encounter.id,
    drafted_by: userId,
    concern_summary: draft.concernSummary,
    patient_reported: draft.patientReported,
    staff_observed: draft.staffObserved,
    items_to_check: draft.itemsToCheck,
    open_questions: draft.openQuestions,
    drafted_from: DRAFT_SOURCE,
  });
  if (briefError) {
    await supabase.from("encounters").delete().eq("id", encounter.id);
    return { error: "Couldn’t prepare the draft brief. Try again." };
  }

  revalidatePath("/queue");
  redirect(`/encounters/${encounter.id}`);
}
