import { z } from "zod";

/**
 * The tablet question guide is intentionally local and deterministic. It
 * helps a person describe their own account but does not assess severity,
 * diagnose, assign priority, or recommend what should happen next.
 *
 * A future governed model integration can replace `adaptiveQuestionIds`
 * without changing the storage, review, or clinician-decision boundaries.
 */
export const QUESTION_IDS = [
  "main_concern",
  "when_started",
  "changed",
  "anything_else",
  "discomfort_location",
  "discomfort_description",
  "breathing_description",
  "injury_how",
  "bleeding_details",
  "neurological_change",
  "medical_context",
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];
type FollowUpQuestionId = Exclude<
  QuestionId,
  "main_concern" | "when_started" | "changed" | "anything_else"
>;

export type CheckInQuestion = {
  id: QuestionId;
  prompt: string;
  helper?: string;
  required?: boolean;
};

export const BASE_QUESTIONS: CheckInQuestion[] = [
  {
    id: "main_concern",
    prompt: "What brought you in today?",
    helper: "Use your own words. Please do not include your name, date of birth, address, or contact details.",
    required: true,
  },
  {
    id: "when_started",
    prompt: "When did you first notice this?",
  },
  {
    id: "changed",
    prompt: "Has anything changed since it began?",
  },
  {
    id: "anything_else",
    prompt: "Is there anything else you would like the clinical team to know?",
  },
];

const FOLLOW_UP_QUESTIONS: Record<FollowUpQuestionId, CheckInQuestion> = {
  discomfort_location: {
    id: "discomfort_location",
    prompt: "Where in your body do you feel it, if anywhere?",
  },
  discomfort_description: {
    id: "discomfort_description",
    prompt: "How would you describe how it feels right now?",
  },
  breathing_description: {
    id: "breathing_description",
    prompt: "Please describe any change you have noticed with your breathing.",
  },
  injury_how: {
    id: "injury_how",
    prompt: "How did the injury happen?",
  },
  bleeding_details: {
    id: "bleeding_details",
    prompt: "Please describe what you have noticed.",
  },
  neurological_change: {
    id: "neurological_change",
    prompt: "Please describe any change in feeling, movement, or awareness.",
  },
  medical_context: {
    id: "medical_context",
    prompt: "Is there any health history, medicine, or allergy information you would like the team to know?",
  },
};

const FOLLOW_UP_RULES: { pattern: RegExp; ids: QuestionId[] }[] = [
  {
    pattern: /\b(pain|ache|aching|hurt|hurts|sore|tight|tightness)\b/i,
    ids: ["discomfort_location", "discomfort_description"],
  },
  {
    pattern: /\b(breath|breathing|breathless|short of breath|can't breathe|cannot breathe)\b/i,
    ids: ["breathing_description"],
  },
  {
    pattern: /\b(fell|fall|injur|twist|twisted|cut|burn|hit|crash|accident)\b/i,
    ids: ["injury_how"],
  },
  {
    pattern: /\b(bleed|bleeding|blood)\b/i,
    ids: ["bleeding_details"],
  },
  {
    pattern: /\b(dizz|faint|passed out|collapse|confus|numb|weak|seizure)\b/i,
    ids: ["neurological_change"],
  },
];

/** At most two relevant follow-ups keep the tablet interaction short. */
export function adaptiveQuestionIds(answers: Record<string, string>): QuestionId[] {
  const text = Object.values(answers).join(" ");
  const selected: QuestionId[] = [];

  for (const rule of FOLLOW_UP_RULES) {
    if (!rule.pattern.test(text)) continue;
    for (const id of rule.ids) {
      if (!selected.includes(id)) selected.push(id);
      if (selected.length === 2) return selected;
    }
  }

  return selected;
}

export function questionsFor(ids: QuestionId[]): CheckInQuestion[] {
  return ids
    .map((id) => FOLLOW_UP_QUESTIONS[id as keyof typeof FOLLOW_UP_QUESTIONS])
    .filter((question): question is CheckInQuestion => Boolean(question));
}

const answerSchema = z.object({
  question_id: z.enum(QUESTION_IDS),
  answer: z.string().trim().min(1).max(1000),
});

export const patientCheckInAnswersSchema = z
  .array(answerSchema)
  .min(1, "Tell us what brought you in before sending your check-in.")
  .max(6, "This check-in has too many answers. Please start again.")
  .superRefine((answers, context) => {
    const ids = new Set<string>();
    for (const [index, answer] of answers.entries()) {
      if (ids.has(answer.question_id)) {
        context.addIssue({
          code: "custom",
          path: [index, "question_id"],
          message: "Each question can only be answered once.",
        });
      }
      ids.add(answer.question_id);
    }
    if (!ids.has("main_concern")) {
      context.addIssue({
        code: "custom",
        message: "Tell us what brought you in before sending your check-in.",
      });
    }
    if (patientAccountFromAnswers(answers).length > 4000) {
      context.addIssue({
        code: "custom",
        message: "Keep your answers under 4,000 characters in total.",
      });
    }
  });

export type PatientCheckInAnswer = z.infer<typeof answerSchema>;

export function patientAccountFromAnswers(answers: PatientCheckInAnswer[]) {
  // Store only the patient's answer text in the clinical source field. Question
  // wording must not be mistaken for a patient-reported fact by the draft matcher.
  return answers.map(({ answer }) => `- ${answer.trim()}`).join("\n");
}

export function presentingConcernFromAnswers(answers: PatientCheckInAnswer[]) {
  return answers.find((answer) => answer.question_id === "main_concern")?.answer.trim() ?? "";
}

export function safePatientCheckInAnswers(value: unknown) {
  return patientCheckInAnswersSchema.safeParse(value);
}
