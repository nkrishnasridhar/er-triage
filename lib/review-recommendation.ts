import "server-only";
import { z } from "zod";
import type { IntakeInput } from "@/lib/draft-brief";
import {
  type ReviewSuggestion,
  unassessedReviewSuggestion,
  validateReviewRecommendation,
} from "@/lib/review-recommendation-validation";

function untrustedIntake(input: IntakeInput) {
  const escape = (value: string) => value.replaceAll("</untrusted_intake>", "[closing tag removed]");
  return `<untrusted_intake>\nPresenting concern: ${escape(input.presentingConcern)}\nPatient account: ${escape(input.patientAccount)}\nStaff observations: ${escape(input.observedSigns)}\n</untrusted_intake>`;
}

/**
 * A narrow, source-linked suggestion used only to choose the initial display
 * order. It is intentionally separate from draft-brief composition.
 */
export async function composeReviewRecommendation(
  input: IntakeInput,
): Promise<ReviewSuggestion> {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  if (!key || !model || key.startsWith("replace-") || model.startsWith("replace-"))
    return unassessedReviewSuggestion();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "For a fictional emergency-department hackathon demo, return JSON only with informationGaps and accountCues arrays. Each informationGaps item is {kind: uncertain|conflicting|missing, quote}; each accountCues item is {quote}. Quotes must be exact excerpts from the untrusted intake. Return at most three in each array. Do not diagnose, assess severity or urgency, assign or recommend a priority, triage category, next step, queue position, confidence, risk, treatment, or safety conclusion. The application, not you, calculates a suggested display order from the counts.",
          },
          { role: "user", content: untrustedIntake(input) },
        ],
      }),
      signal: controller.signal,
    });
    if (!response.ok) return unassessedReviewSuggestion();
    const body: unknown = await response.json();
    const content = z
      .object({ choices: z.array(z.object({ message: z.object({ content: z.string().nullable() }) })).min(1) })
      .safeParse(body);
    if (!content.success || !content.data.choices[0].message.content)
      return unassessedReviewSuggestion();
    const candidate: unknown = JSON.parse(content.data.choices[0].message.content);
    return validateReviewRecommendation(input, candidate, model) ?? unassessedReviewSuggestion();
  } catch {
    return unassessedReviewSuggestion();
  } finally {
    clearTimeout(timer);
  }
}
