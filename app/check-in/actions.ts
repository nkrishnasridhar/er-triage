"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import {
  patientAccountFromAnswers,
  patientCheckInAnswersSchema,
  presentingConcernFromAnswers,
} from "@/lib/patient-check-in";
import { createClient } from "@/lib/supabase/server";

export type PatientCheckInState = {
  error?: string;
  checkInCode?: string;
};

function nextCheckInCode() {
  return `CHK-${randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase()}`;
}

/**
 * A public tablet action. It intentionally accepts only a bounded array of
 * answers and never accepts an identity, priority, diagnosis, or user id.
 */
export async function submitPatientCheckIn(
  _: PatientCheckInState,
  form: FormData,
): Promise<PatientCheckInState> {
  const rawAnswers = form.get("answers");
  let decoded: unknown;
  try {
    decoded = JSON.parse(String(rawAnswers ?? ""));
  } catch {
    return { error: "We could not read those answers. Please try again." };
  }

  const parsed = patientCheckInAnswersSchema.safeParse(decoded);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const patientAccount = patientAccountFromAnswers(parsed.data);
  const presentingConcern = presentingConcernFromAnswers(parsed.data);

  // A code is the only thing the patient needs to show staff. Retries cover
  // the unlikely event that a short code collides with an existing one.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const checkInCode = nextCheckInCode();
    const { error } = await supabase.from("patient_checkins").insert({
      check_in_code: checkInCode,
      presenting_concern: presentingConcern,
      answers: parsed.data,
      patient_account: patientAccount,
    });
    if (!error) {
      revalidatePath("/queue");
      return { checkInCode };
    }
    if (error.code !== "23505") break;
  }

  return {
    error: "We could not send your check-in. Please tell a staff member and try again.",
  };
}
