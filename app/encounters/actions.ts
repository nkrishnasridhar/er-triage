"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { buildDraftBrief, DRAFT_SOURCE } from "@/lib/draft-brief";
import {
  briefApprovalSchema,
  briefDraftSchema,
  encounterSchema,
  idSchema,
  type FormState,
} from "@/lib/validation";

/** Empty form fields arrive as "", which is not a number. */
function optionalAge(raw: FormDataEntryValue | null) {
  if (raw === null) return undefined;
  const trimmed = String(raw).trim();
  if (trimmed === "") return undefined;
  return Number(trimmed);
}

export async function submitEncounter(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const { supabase, userId, email } = await requireUser();
  const parsed = encounterSchema.safeParse({
    patient_reference: form.get("patient_reference"),
    age_years: optionalAge(form.get("age_years")),
    presenting_concern: form.get("presenting_concern"),
    patient_account: form.get("patient_account") ?? "",
    observed_signs: form.get("observed_signs") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // A pure function, so the draft exists before anything is written. If the
  // brief cannot be stored the encounter is removed again rather than left
  // sitting in the queue with nothing to review.
  const draft = buildDraftBrief({
    presentingConcern: parsed.data.presenting_concern,
    patientAccount: parsed.data.patient_account,
    observedSigns: parsed.data.observed_signs,
  });

  const { data: encounter, error: encounterError } = await supabase
    .from("encounters")
    .insert({
      patient_reference: parsed.data.patient_reference,
      age_years: parsed.data.age_years ?? null,
      presenting_concern: parsed.data.presenting_concern,
      patient_account: parsed.data.patient_account,
      observed_signs: parsed.data.observed_signs,
      recorded_by: userId,
      recorded_by_label: email,
    })
    .select("id")
    .single();
  if (encounterError || !encounter)
    return { error: "Couldn’t save this intake. Check the connection and try again." };

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
    return {
      error:
        "Couldn’t prepare the draft brief, so this intake was not saved. Try again.",
    };
  }

  revalidatePath("/queue");
  redirect(`/encounters/${encounter.id}`);
}

async function loadDraftBrief(briefId: FormDataEntryValue | null) {
  const { supabase, userId, email } = await requireUser();
  const id = idSchema.safeParse(briefId);
  if (!id.success) return { error: "That brief could not be found." as const };
  const { data, error } = await supabase
    .from("triage_briefs")
    .select("id, encounter_id, status")
    .eq("id", id.data)
    .maybeSingle();
  if (error) return { error: "Could not load that brief." as const };
  if (!data) return { error: "That brief could not be found." as const };
  if (data.status === "approved")
    return {
      error:
        "This brief is already approved. An approved record cannot be changed.",
    } as const;
  return { supabase, userId, email, brief: data } as const;
}

function draftEdits(form: FormData) {
  return {
    concern_summary: form.get("concern_summary") ?? "",
    items_to_check: form.get("items_to_check") ?? "",
    open_questions: form.get("open_questions") ?? "",
    clinician_notes: form.get("clinician_notes") ?? "",
  };
}

/** Keeps a working draft without attaching a decision. */
export async function saveBrief(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const loaded = await loadDraftBrief(form.get("brief_id"));
  if ("error" in loaded) return { error: loaded.error };

  const parsed = briefDraftSchema.safeParse({
    ...draftEdits(form),
    intent: "save",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // `intent` steers this action and is not a column, so the editable fields are
  // named explicitly rather than spreading the parsed object into the update.
  const { error } = await loaded.supabase
    .from("triage_briefs")
    .update({
      concern_summary: parsed.data.concern_summary,
      items_to_check: parsed.data.items_to_check,
      open_questions: parsed.data.open_questions,
      clinician_notes: parsed.data.clinician_notes,
    })
    .eq("id", loaded.brief.id);
  if (error) return { error: "Couldn’t save your changes. Try again." };

  revalidatePath(`/encounters/${loaded.brief.encounter_id}`);
  return { success: "Draft saved. Still waiting on a clinician decision." };
}

/**
 * The one-way transition. The database independently refuses to mark a brief
 * approved without a priority, a next step, a reviewer and a timestamp, so a
 * bug in this action cannot produce an undecided handover record.
 */
export async function approveBrief(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  const loaded = await loadDraftBrief(form.get("brief_id"));
  if ("error" in loaded) return { error: loaded.error };

  const parsed = briefApprovalSchema.safeParse({
    ...draftEdits(form),
    intent: "approve",
    priority: form.get("priority") ?? "",
    next_step: form.get("next_step") ?? "",
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      error: `${issue.message} A priority and a next step are both required before approval.`,
    };
  }

  const { error } = await loaded.supabase
    .from("triage_briefs")
    .update({
      concern_summary: parsed.data.concern_summary,
      items_to_check: parsed.data.items_to_check,
      open_questions: parsed.data.open_questions,
      clinician_notes: parsed.data.clinician_notes,
      priority: parsed.data.priority,
      next_step: parsed.data.next_step,
      status: "approved",
      reviewed_by: loaded.userId,
      reviewed_by_label: loaded.email,
      approved_at: new Date().toISOString(),
    })
    .eq("id", loaded.brief.id)
    .eq("status", "draft");
  if (error) return { error: "Couldn’t approve this brief. Try again." };

  revalidatePath(`/encounters/${loaded.brief.encounter_id}`);
  revalidatePath("/queue");
  return { success: "Approved. This is now the handover record." };
}

/**
 * One form, two buttons. The pressed button's name/value arrives as `intent`,
 * so a single form can carry both the editable text and the decision without
 * duplicating the fields.
 */
export async function reviewBrief(
  state: FormState,
  form: FormData,
): Promise<FormState> {
  const intent = form.get("intent");
  if (intent === "approve") return approveBrief(state, form);
  if (intent === "save") return saveBrief(state, form);
  return { error: "Choose whether to save a draft or approve this brief." };
}
