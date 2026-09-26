import { z } from "zod";
import { NEXT_STEP_OPTIONS, PRIORITY_OPTIONS, type NextStep, type Priority } from "@/lib/triage";

export const emailSchema = z.email().trim().toLowerCase().max(254);
export const passwordSchema = z.string().min(1, "Enter your password.");
export const idSchema = z.uuid();

/** Column limits here mirror the CHECK constraints in the triage migration. */
export const encounterSchema = z.object({
  patient_reference: z
    .string()
    .trim()
    .min(1, "Enter the patient reference.")
    .max(64, "Keep the patient reference under 65 characters."),
  age_years: z
    .number()
    .int()
    .min(0, "Age cannot be negative.")
    .max(130, "Check that age.")
    .optional(),
  presenting_concern: z
    .string()
    .trim()
    .min(1, "Enter the presenting concern in a few words.")
    .max(200, "Keep the presenting concern under 201 characters."),
  patient_account: z
    .string()
    .trim()
    .max(4000, "Keep the account under 4,000 characters.")
    .default(""),
  observed_signs: z
    .string()
    .trim()
    .max(2000, "Keep observations under 2,000 characters.")
    .default(""),
});

/** The anonymous tablet has a deliberately smaller input surface. */
export const tabletEncounterSchema = z.object({
  patient_reference: z
    .string()
    .trim()
    .min(1, "Enter the local patient reference.")
    .max(64, "Keep the reference under 65 characters."),
  presenting_concern: z
    .string()
    .trim()
    .min(1, "Briefly describe why you are here.")
    .max(200, "Keep the concern under 201 characters."),
  patient_account: z
    .string()
    .trim()
    .min(1, "Tell us what is happening in your own words.")
    .max(4000, "Keep your account under 4,000 characters."),
  speech_used: z.boolean().default(false),
});

export const writtenTabletQuestionsSchema = z.object({
  patient_age: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter age in years as a number.")
    .transform(Number)
    .pipe(z.number().int().min(0, "Age cannot be negative.").max(130, "Check that age.")),
  sex_assigned_at_birth: z.string().trim().min(1, "Enter sex assigned at birth.").max(80),
  when_started: z.string().trim().min(1, "Say when this started.").max(500),
  what_changed: z.string().trim().min(1, "Say whether anything has changed.").max(500),
  current_symptoms: z.string().trim().min(1, "Describe your symptoms.").max(1000),
  anything_else: z.string().trim().min(1, "Answer the final question, or write ‘Nothing else’.").max(1000),
});

const prioritySchema = z.enum(
  PRIORITY_OPTIONS.map((option) => option.value) as [Priority, ...Priority[]],
);
const nextStepSchema = z.enum(
  NEXT_STEP_OPTIONS.map((option) => option.value) as [NextStep, ...NextStep[]],
);

const editableDraft = {
  concern_summary: z
    .string()
    .trim()
    .max(600, "Keep the summary under 600 characters.")
    .default(""),
  items_to_check: z
    .string()
    .trim()
    .max(4000, "Keep the checklist under 4,000 characters.")
    .default(""),
  open_questions: z
    .string()
    .trim()
    .max(2000, "Keep the questions under 2,000 characters.")
    .default(""),
  clinician_notes: z
    .string()
    .trim()
    .max(4000, "Keep your notes under 4,000 characters.")
    .default(""),
};

/** Saving a working draft. No decision is attached yet. */
export const briefDraftSchema = z.object({
  ...editableDraft,
  intent: z.literal("save"),
});

/** Approving a brief. A clinician decision is mandatory and cannot be defaulted. */
export const briefApprovalSchema = z.object({
  ...editableDraft,
  intent: z.literal("approve"),
  priority: prioritySchema,
  next_step: nextStepSchema,
});

export type EncounterInput = z.infer<typeof encounterSchema>;
export type FormState = { error?: string; success?: string; email?: string };
export type TabletFormState = Pick<FormState, "error" | "success">;
