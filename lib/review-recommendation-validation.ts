import { z } from "zod";
import type { IntakeInput } from "@/lib/draft-brief";

export const REVIEW_BANDS = [
  "suggested_first",
  "suggested_next",
  "suggested_later",
  "suggested_last",
  "unassessed",
] as const;

export type ReviewBand = (typeof REVIEW_BANDS)[number];
export type ReviewReason = {
  kind: "information_gap" | "account_cue";
  subtype?: "uncertain" | "conflicting" | "missing";
  quote: string;
};

export type ReviewSuggestion = {
  attentionBand: ReviewBand;
  informationGapScore: number;
  accountCueScore: number;
  rankScore: number;
  reasons: ReviewReason[];
  source: "model-v1" | "unassessed";
  modelVersion: string | null;
};

const modelRecommendationSchema = z.strictObject({
  informationGaps: z
    .array(
      z.strictObject({
        kind: z.enum(["uncertain", "conflicting", "missing"]),
        quote: z.string().trim().min(2).max(240),
      }),
    )
    .max(3),
  accountCues: z
    .array(
      z.strictObject({ quote: z.string().trim().min(2).max(240) }),
    )
    .max(3),
});

function isPromptInjectionLike(quote: string) {
  return (
    /\b(ignore|disregard|forget|override)\b[\s\S]{0,120}\b(previous|prior|system|developer|instructions?|rules?|prompt)\b/i.test(
      quote,
    ) || /\b(system|developer)\s+(message|prompt|instructions?)\b/i.test(quote)
  );
}

export function bandForScore(rankScore: number): Exclude<ReviewBand, "unassessed"> {
  if (rankScore >= 6) return "suggested_first";
  if (rankScore >= 4) return "suggested_next";
  if (rankScore >= 2) return "suggested_later";
  return "suggested_last";
}

export function unassessedReviewSuggestion(): ReviewSuggestion {
  return {
    attentionBand: "unassessed",
    informationGapScore: 0,
    accountCueScore: 0,
    rankScore: -1,
    reasons: [],
    source: "unassessed",
    modelVersion: null,
  };
}

/**
 * Model output may only point back to recorded words. It cannot carry a
 * diagnosis, triage category, confidence score, treatment, or free-text risk
 * explanation into the UI.
 */
export function validateReviewRecommendation(
  input: IntakeInput,
  candidate: unknown,
  modelVersion: string,
): ReviewSuggestion | null {
  const parsed = modelRecommendationSchema.safeParse(candidate);
  if (!parsed.success) return null;

  const source = `${input.patientAccount}\n${input.observedSigns}`.toLocaleLowerCase();
  const reasons: ReviewReason[] = [];
  const seenQuotes = new Set<string>();

  for (const gap of parsed.data.informationGaps) {
    const quote = gap.quote.trim();
    const key = quote.toLocaleLowerCase();
    if (!source.includes(key) || seenQuotes.has(key) || isPromptInjectionLike(quote)) return null;
    seenQuotes.add(key);
    reasons.push({ kind: "information_gap", subtype: gap.kind, quote });
  }

  for (const cue of parsed.data.accountCues) {
    const quote = cue.quote.trim();
    const key = quote.toLocaleLowerCase();
    if (!source.includes(key) || seenQuotes.has(key) || isPromptInjectionLike(quote)) return null;
    seenQuotes.add(key);
    reasons.push({ kind: "account_cue", quote });
  }

  const informationGapScore = parsed.data.informationGaps.length;
  const accountCueScore = parsed.data.accountCues.length;
  const rankScore = informationGapScore * 2 + accountCueScore;

  return {
    attentionBand: bandForScore(rankScore),
    informationGapScore,
    accountCueScore,
    rankScore,
    reasons,
    source: "model-v1",
    modelVersion,
  };
}

export const REVIEW_BAND_LABEL: Record<ReviewBand, string> = {
  suggested_first: "Suggested first",
  suggested_next: "Suggested next",
  suggested_later: "Suggested later",
  suggested_last: "Suggested last",
  unassessed: "Unassessed",
};

export const REVIEW_REASON_LABEL: Record<ReviewReason["kind"], string> = {
  information_gap: "Information to clarify",
  account_cue: "Account cue for clinician review",
};

export function reviewBandOrder(band: ReviewBand) {
  return band === "unassessed" ? -1 : REVIEW_BANDS.indexOf(band);
}

export function compareSuggestedReviewOrder(
  left: { rankScore: number; createdAt: string },
  right: { rankScore: number; createdAt: string },
) {
  if (left.rankScore !== right.rankScore) return right.rankScore - left.rankScore;
  return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
}
