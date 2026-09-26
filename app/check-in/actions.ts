"use server";

import { composeDraftBrief } from "@/lib/brief-composition";
import { isConfigured } from "@/lib/config";
import { createPublicClient } from "@/lib/supabase/public";
import {
  tabletEncounterSchema,
  writtenTabletQuestionsSchema,
  type TabletFormState,
} from "@/lib/validation";

/** Public by design: validates a narrowly scoped, anonymous tablet hand-off. */
export async function submitTabletEncounter(
  _: TabletFormState,
  form: FormData,
): Promise<TabletFormState> {
  if (!isConfigured()) return { error: "Check-in is not configured yet." };
  const voiceAccount = form.get("patient_account");
  let patientAccount = voiceAccount;
  if (typeof voiceAccount !== "string" || !voiceAccount.trim()) {
    const answers = writtenTabletQuestionsSchema.safeParse({
      patient_name: form.get("patient_name"),
      patient_age: form.get("patient_age"),
      patient_sex: form.get("patient_sex"),
      when_started: form.get("when_started"),
      what_changed: form.get("what_changed"),
      current_symptoms: form.get("current_symptoms"),
      anything_else: form.get("anything_else"),
    });
    if (!answers.success) return { error: answers.error.issues[0].message };
    patientAccount = [
      `Name: ${answers.data.patient_name}; age: ${answers.data.patient_age}; sex: ${answers.data.patient_sex}`,
      `When did this start? ${answers.data.when_started}`,
      `Has it changed since it started? ${answers.data.what_changed}`,
      `What symptoms are you experiencing right now? ${answers.data.current_symptoms}`,
      `Is there anything else you’d like staff to know, including medicines, allergies, or health conditions? ${answers.data.anything_else}`,
    ].join("\n");
  }
  const parsed = tabletEncounterSchema.safeParse({
    patient_reference: form.get("patient_reference"),
    presenting_concern: form.get("presenting_concern"),
    patient_account: patientAccount,
    speech_used: form.get("speech_used") === "true",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const composed = await composeDraftBrief({
    presentingConcern: parsed.data.presenting_concern,
    patientAccount: parsed.data.patient_account,
    observedSigns: "",
  });
  const supabase = createPublicClient();
  const { error } = await supabase.rpc("capture_tablet_intake", {
    patient_reference_input: parsed.data.patient_reference,
    presenting_concern_input: parsed.data.presenting_concern,
    patient_account_input: parsed.data.patient_account,
    speech_used_input: parsed.data.speech_used,
    concern_summary_input: composed.draft.concernSummary,
    items_to_check_input: composed.draft.itemsToCheck,
    open_questions_input: composed.draft.openQuestions,
    drafted_from_input: composed.source,
  });
  if (error) return { error: "Your account was not sent. Please try again." };
  return { success: "Your account has been sent to the clinical team." };
}
