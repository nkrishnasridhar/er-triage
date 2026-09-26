import test from "node:test";
import assert from "node:assert/strict";
import {
  adaptiveQuestionIds,
  patientAccountFromAnswers,
  patientCheckInAnswersSchema,
} from "../lib/patient-check-in";

test("the tablet asks relevant follow-ups without assigning urgency", () => {
  const questions = adaptiveQuestionIds({
    main_concern: "I have chest pain and it hurts when I breathe.",
  });
  assert.deepEqual(questions, ["discomfort_location", "discomfort_description"]);
  assert.equal(questions.some((question) => /priority|severity|triage|urgent/i.test(question)), false);
});

test("patient check-in answers are bounded and must include the main concern", () => {
  assert.equal(
    patientCheckInAnswersSchema.safeParse([
      { question_id: "when_started", answer: "This morning" },
    ]).success,
    false,
  );
  assert.equal(
    patientCheckInAnswersSchema.safeParse([
      { question_id: "main_concern", answer: "I hurt my ankle" },
      { question_id: "main_concern", answer: "Again" },
    ]).success,
    false,
  );
  assert.equal(
    patientCheckInAnswersSchema.safeParse([
      { question_id: "main_concern", answer: "I hurt my ankle" },
      { question_id: "unknown", answer: "Not allowed" },
    ]).success,
    false,
  );
});

test("the clinical source contains only answer text, never question wording", () => {
  const answers = patientCheckInAnswersSchema.parse([
    { question_id: "main_concern", answer: "My ankle hurts after I fell." },
    { question_id: "when_started", answer: "About an hour ago." },
  ]);
  const patientAccount = patientAccountFromAnswers(answers);
  assert.match(patientAccount, /My ankle hurts after I fell/);
  assert.equal(patientAccount.includes("What brought you in today?"), false);
  assert.equal(patientAccount.includes("When did you first notice this?"), false);
});
