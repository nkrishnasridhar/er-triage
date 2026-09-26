import test from "node:test";
import assert from "node:assert/strict";
import { deterministicFallback, validateModelDraft } from "../lib/brief-composition-validation";

const intake = {
  presentingConcern: "Ankle pain",
  patientAccount: "I twisted my ankle on the step and it hurts when I stand.",
  observedSigns: "",
};

test("a model draft cannot rewrite captured provenance", () => {
  const result = validateModelDraft(intake, {
    concernSummary: "Ankle pain after a twist.",
    itemsToCheck: '- Patient reported: "twisted my ankle" — recorded in the account.',
    openQuestions: "When did this happen?",
  });
  assert.ok(result);
  assert.equal(result.patientReported, intake.patientAccount);
  assert.equal(result.staffObserved, "");
});

test("model language that assigns or implies a clinical decision is rejected", () => {
  for (const concernSummary of [
    "Urgency is high.",
    "Priority should be immediate.",
    "ATS 1 is recommended.",
    "Likely diagnosis is an ankle fracture.",
    "Risk score: 8.",
  ]) {
    assert.equal(
      validateModelDraft(intake, {
        concernSummary,
        itemsToCheck: '- Patient reported: "twisted my ankle" — recorded.',
        openQuestions: "When did this happen?",
      }),
      null,
      `${concernSummary} must not reach a clinician brief`,
    );
  }
});

test("model items must quote text that was actually captured", () => {
  assert.equal(
    validateModelDraft(intake, {
      concernSummary: "Ankle pain.",
      itemsToCheck: '- Patient reported: "severe bleeding" — recorded.',
      openQuestions: "When did this happen?",
    }),
    null,
  );
});

test("the deterministic fallback preserves the source account without a clinical decision", () => {
  const result = deterministicFallback(intake);
  assert.equal(result.source, "deterministic-fallback-v1");
  assert.equal(result.draft.patientReported, intake.patientAccount);
  assert.doesNotMatch(result.draft.itemsToCheck, /priority|triage|diagnos/i);
});
