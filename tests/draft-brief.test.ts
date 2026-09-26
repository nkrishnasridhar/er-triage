import test from "node:test";
import assert from "node:assert/strict";
import { buildDraftBrief } from "../lib/draft-brief";

test("provenance stays separated: what the patient said, what staff saw", () => {
  const draft = buildDraftBrief({
    presentingConcern: "Chest pain since this morning",
    patientAccount: "I have a heavy chest pain and I am sweating",
    observedSigns: "Appears pale and confused. Speaking in short sentences.",
  });
  assert.equal(draft.concernSummary, "Chest pain since this morning");
  assert.equal(draft.patientReported, "I have a heavy chest pain and I am sweating");
  assert.equal(
    draft.staffObserved,
    "Appears pale and confused. Speaking in short sentences.",
  );
  assert.match(draft.itemsToCheck, /Patient reported: "chest pain"/);
  assert.match(draft.itemsToCheck, /Patient reported: "sweating"/);
  assert.match(draft.itemsToCheck, /Staff noted: "confused"/);
  // A phrase only ever appears under the source it came from.
  assert.equal(
    draft.itemsToCheck.includes('Staff noted: "chest pain"'),
    false,
  );
});

test("no phrase is ever assigned a priority or a triage category", () => {
  const draft = buildDraftBrief({
    presentingConcern: "Chest pain",
    patientAccount: "Severe chest pain, sudden and radiating, I feel faint.",
    observedSigns: "Sweating. Appears collapsed.",
  });
  const lowered = draft.itemsToCheck.toLowerCase();
  for (const forbidden of [
    "category",
    "triage level",
    "priority",
    "esi",
    "diagnos",
    "recommend",
    "should be seen",
  ]) {
    assert.equal(
      lowered.includes(forbidden),
      false,
      `draft must not contain "${forbidden}"`,
    );
  }
});

test("the longer phrase wins so a prompt is not reported twice", () => {
  const draft = buildDraftBrief({
    presentingConcern: "Follow up",
    patientAccount: "My blood pressure has been high all week.",
    observedSigns: "",
  });
  assert.match(draft.itemsToCheck, /Patient reported: "blood pressure"/);
  assert.equal(
    draft.itemsToCheck.includes('Patient reported: "blood" —'),
    false,
    "the bare word should not be listed once the longer phrase matched",
  );
});

test("no match is reported as an absence, never as reassurance", () => {
  const draft = buildDraftBrief({
    presentingConcern: "Sore throat",
    patientAccount: "It started three days ago and is a mild ache.",
    observedSigns: "No observations recorded.",
  });
  assert.match(draft.itemsToCheck, /not reassurance/i);
  assert.equal(draft.itemsToCheck.includes("low risk"), false);
  assert.equal(draft.itemsToCheck.includes("routine"), false);
});

test("missing information becomes a question rather than a finding", () => {
  const draft = buildDraftBrief({
    presentingConcern: "Pain",
    patientAccount: "",
    observedSigns: "",
  });
  assert.match(draft.openQuestions, /patient's own words/i);
  assert.match(draft.openQuestions, /observations/i);
  assert.match(draft.openQuestions, /onset and duration/i);
  assert.match(draft.openQuestions, /severity/i);
  assert.match(draft.openQuestions, /allergies/i);
  // Nothing was captured, so nothing can be claimed to have been found.
  assert.equal(draft.itemsToCheck.includes("chest"), false);
});

test("a thorough account produces no missing-information prompts", () => {
  const draft = buildDraftBrief({
    presentingConcern: "Worsening headache since yesterday",
    patientAccount:
      "The headache started yesterday and is severe. I feel dizzy and I have been vomiting. I take regular medication and I am allergic to penicillin.",
    observedSigns: "Alert and orientated. Observations taken and within normal limits.",
  });
  assert.match(draft.openQuestions, /No missing-information prompts remain/);
});

test("whitespace is trimmed and never leaks into the brief", () => {
  const draft = buildDraftBrief({
    presentingConcern: "   Ankle injury   ",
    patientAccount: "  I twisted it playing football.  ",
    observedSigns: "   Swollen, no deformity.  ",
  });
  assert.equal(draft.concernSummary, "Ankle injury");
  assert.equal(draft.patientReported, "I twisted it playing football.");
  assert.equal(draft.staffObserved, "Swollen, no deformity.");
  for (const line of draft.itemsToCheck.split("\n")) {
    assert.equal(line, line.trim());
  }
});
