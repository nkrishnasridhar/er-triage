/**
 * Local draft generator for triage briefs.
 *
 * NOT A CLINICAL INSTRUMENT.
 *
 * This module does literal text matching over words a staff member typed. It
 * does not assess severity, does not suggest a diagnosis, and does not assign,
 * imply or hint at a triage category or a priority. Everything it emits is a
 * prompt for a clinician to look at something, or a note that information is
 * missing. Those are different things, and the difference is the product.
 *
 * A match here means "this phrase appeared in the notes". It never means "this
 * patient is sicker than another". The priority field is clinician-supplied and
 * this module has no access to it.
 *
 * Swap point: `buildDraftBrief` is the only function the Server Action calls.
 * A hosted model can replace it behind the same signature, and the review,
 * approval and audit behaviour around it would not change.
 */

export const DRAFT_SOURCE = "local-rules-v1";

export type IntakeInput = {
  presentingConcern: string;
  patientAccount: string;
  observedSigns: string;
};

export type DraftBrief = {
  concernSummary: string;
  patientReported: string;
  staffObserved: string;
  itemsToCheck: string;
  openQuestions: string;
};

/**
 * Phrases that prompt a clinician to look again. This is a reading aid, not a
 * rule set: no entry carries a weight, an order or an implication of severity,
 * and a phrase appearing twice is no more significant than appearing once.
 */
const REVIEW_PROMPTS = [
  "chest pain",
  "chest tight",
  "breathless",
  "short of breath",
  "cannot breathe",
  "can't breathe",
  "struggling to breathe",
  "bleeding",
  "blood",
  "passed out",
  "unconscious",
  "collapsed",
  "seizure",
  "confused",
  "confusion",
  "not making sense",
  "dizzy",
  "faint",
  "severe",
  "sudden",
  "suddenly",
  "worsening",
  "getting worse",
  "radiating",
  "spreading",
  "sweating",
  "vomiting",
  "throwing up",
  "pregnant",
  "allergic",
  "allergy",
  "medication",
  "medicines",
  "blood pressure",
  "blood sugar",
  "diabetic",
  "epilepsy",
  "chemotherapy",
  "immunosuppressed",
] as const;

type DetailCheck = {
  pattern: RegExp;
  question: string;
};

const MISSING_DETAIL: DetailCheck[] = [
  {
    pattern:
      /\b(since|start(ed|ing)?|began|came on|onset|days?|hours?|weeks?|months?|years?|sudden(ly)?)\b/,
    question:
      "Onset and duration were not evident in the notes. Confirm when this started and whether it is changing.",
  },
  {
    pattern:
      /\b(sever(e|ity)|excruciating|unbearable|worst|mild|moderate|how bad|out of ten|pain score|scaled)\b/,
    question:
      "Severity was not evident in the notes. Record how bad it is, in the patient's own words.",
  },
  {
    pattern:
      /\b(medication|medicines|allergic|allergy|allergies|past history|history of|pmh|diabet|epilep|pregnan|chemotherap|immunosuppress|takes?|regularly)\b/,
    question:
      "Past history, medications and allergies were not evident. Confirm these before any decision is made.",
  },
];

/** Report the longest phrase at each position so "blood pressure" wins over "blood". */
function longestMatches(text: string, phrases: readonly string[]): string[] {
  const lower = text.toLowerCase();
  const found = phrases
    .map((phrase) => ({ phrase, at: lower.indexOf(phrase) }))
    .filter((hit) => hit.at !== -1)
    .sort((a, b) => a.at - b.at || a.phrase.length - b.phrase.length);

  const kept: string[] = [];
  for (const hit of found) {
    // A longer phrase already found at or before this position covers it.
    if (kept.some((keptPhrase) => keptPhrase.includes(hit.phrase))) continue;
    // This phrase is longer than something already kept, so drop the shorter.
    for (let index = kept.length - 1; index >= 0; index -= 1) {
      if (hit.phrase.includes(kept[index])) kept.splice(index, 1);
    }
    kept.push(hit.phrase);
  }
  return kept;
}

function sourceLines(
  label: string,
  text: string,
  phrases: readonly string[],
): string[] {
  return longestMatches(text, phrases).map(
    (phrase) => `- ${label}: "${phrase}" — matched in the recorded text. Confirm clinically.`,
  );
}

function describeMissing(intake: IntakeInput): string[] {
  const combined = `${intake.patientAccount} ${intake.observedSigns}`;
  const questions: string[] = [];

  if (!intake.patientAccount.trim())
    questions.push(
      "No account was recorded in the patient's own words. Record what the patient said.",
    );
  if (!intake.observedSigns.trim())
    questions.push(
      "No observations were recorded. Add what staff can see and measure.",
    );
  if (intake.presentingConcern.trim().length < 25)
    questions.push(
      "The presenting concern is very brief. Confirm the fuller story with the patient.",
    );
  for (const check of MISSING_DETAIL) {
    if (!check.pattern.test(combined)) questions.push(check.question);
  }

  if (questions.length === 0)
    questions.push(
      "No missing-information prompts remain. Re-check against the patient in front of you.",
    );

  return questions;
}

export function buildDraftBrief(intake: IntakeInput): DraftBrief {
  const presenting = intake.presentingConcern.trim();
  const account = intake.patientAccount.trim();
  const observed = intake.observedSigns.trim();

  const items = [
    ...sourceLines("Patient reported", account, REVIEW_PROMPTS),
    ...sourceLines("Staff noted", observed, REVIEW_PROMPTS),
  ];

  if (items.length === 0)
    items.push(
      "- No phrase in this account matched the review prompts. This is not reassurance: it means only that nothing was recognised, not that the patient is well.",
    );

  return {
    concernSummary: presenting,
    patientReported: account,
    staffObserved: observed,
    itemsToCheck: items.join("\n"),
    openQuestions: describeMissing(intake)
      .map((question) => `- ${question}`)
      .join("\n"),
  };
}
