"use server";

import { composeDraftBrief } from "@/lib/brief-composition";
import { isConfigured } from "@/lib/config";
import { createPublicClient } from "@/lib/supabase/public";
import { tabletEncounterSchema, type TabletFormState } from "@/lib/validation";

/** Public by design: validates a narrowly scoped, anonymous tablet hand-off. */
export async function submitTabletEncounter(
  _: TabletFormState,
  form: FormData,
): Promise<TabletFormState> {
  if (!isConfigured()) return { error: "Check-in is not configured yet." };
  const parsed = tabletEncounterSchema.safeParse({
    patient_reference: form.get("patient_reference"),
    presenting_concern: form.get("presenting_concern"),
    patient_account: form.get("patient_account"),
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
