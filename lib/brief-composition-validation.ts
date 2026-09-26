import { z } from "zod";
import { buildDraftBrief, type DraftBrief, type IntakeInput } from "@/lib/draft-brief";

const MODEL_FORBIDDEN = [
  /\bdiagnos/i,
  /\bseverity\b/i,
  /\burgency\b/i,
  /\btriage(?:\s+category)?\b/i,
  /\bpriority\b/i,
  /\bnext\s+step\b/i,
  /\bqueue(?:\s+rank|ing)?\b/i,
  /\bconfidence\b/i,
  /\brisk(?:\s+score)?\b/i,
  /\b(?:ATS|ESI)\s*[1-5]\b/i,
];

const modelDraftSchema = z.strictObject({
  concernSummary: z.string().trim().min(1).max(600),
  itemsToCheck: z.string().trim().max(4000),
  openQuestions: z.string().trim().max(2000),
});

function containsForbiddenLanguage(value: string) {
  return MODEL_FORBIDDEN.some((pattern) => pattern.test(value));
}

/** Validates model organisation while preserving captured wording verbatim. */
export function validateModelDraft(
  input: IntakeInput,
  candidate: unknown,
): DraftBrief | null {
  const parsed = modelDraftSchema.safeParse(candidate);
  if (!parsed.success) return null;
  const values = Object.values(parsed.data);
  if (values.some(containsForbiddenLanguage)) return null;

  const source = `${input.patientAccount}\n${input.observedSigns}`.toLocaleLowerCase();
  const quotedTerms = [...parsed.data.itemsToCheck.matchAll(/"([^"\n]+)"/g)].map(
    (match) => match[1].toLocaleLowerCase(),
  );
  if (quotedTerms.some((term) => !source.includes(term))) return null;

  return {
    concernSummary: parsed.data.concernSummary,
    patientReported: input.patientAccount.trim(),
    staffObserved: input.observedSigns.trim(),
    itemsToCheck: parsed.data.itemsToCheck,
    openQuestions: parsed.data.openQuestions,
  };
}

export function deterministicFallback(input: IntakeInput) {
  return { draft: buildDraftBrief(input), source: "deterministic-fallback-v1" as const };
}
