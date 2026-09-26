import test from "node:test";
import assert from "node:assert/strict";
import {
  briefApprovalSchema,
  briefDraftSchema,
  emailSchema,
  codeSchema,
  encounterSchema,
  idSchema,
} from "../lib/validation";

test("auth inputs and record identifiers reject malformed requests", () => {
  assert.equal(emailSchema.safeParse("not-an-email").success, false);
  assert.equal(emailSchema.parse("Justus@EXAMPLE.com"), "justus@example.com");
  assert.equal(codeSchema.safeParse("123456").success, true);
  assert.equal(codeSchema.safeParse("12abc6").success, false);
  assert.equal(idSchema.safeParse("not-an-id").success, false);
});

test("intake trims text and rejects blank or oversized content", () => {
  const parsed = encounterSchema.parse({
    patient_reference: "  MRN-004821  ",
    presenting_concern: "  Chest pain since this morning  ",
    patient_account: "  It started this morning.  ",
  });
  assert.equal(parsed.patient_reference, "MRN-004821");
  assert.equal(parsed.presenting_concern, "Chest pain since this morning");
  assert.equal(parsed.patient_account, "It started this morning.");
  // Optional fields fall back to empty rather than being left undefined.
  assert.equal(parsed.observed_signs, "");

  for (const presenting_concern of ["", "   ", "x".repeat(201)]) {
    assert.equal(
      encounterSchema.safeParse({
        patient_reference: "MRN-1",
        presenting_concern,
      }).success,
      false,
    );
  }
  assert.equal(
    encounterSchema.safeParse({
      patient_reference: "MRN-1",
      presenting_concern: "Valid",
      patient_account: "x".repeat(4001),
    }).success,
    false,
  );
});

test("an implausible age is rejected rather than silently dropped", () => {
  const base = { patient_reference: "MRN-1", presenting_concern: "Valid" };
  assert.equal(encounterSchema.safeParse({ ...base, age_years: 44 }).success, true);
  assert.equal(encounterSchema.safeParse({ ...base, age_years: 130 }).success, true);
  assert.equal(encounterSchema.safeParse({ ...base, age_years: -1 }).success, false);
  assert.equal(encounterSchema.safeParse({ ...base, age_years: 131 }).success, false);
  assert.equal(encounterSchema.safeParse({ ...base, age_years: 4.5 }).success, false);
  assert.equal(encounterSchema.safeParse({ ...base, age_years: "old" }).success, false);
});

test("a draft can be saved without any decision attached", () => {
  const parsed = briefDraftSchema.safeParse({ intent: "save" });
  assert.equal(parsed.success, true);
  assert.equal("priority" in (parsed.data ?? {}), false);
});

test("approving requires a clinician priority and a next step", () => {
  const base = { intent: "approve" } as const;
  assert.equal(briefApprovalSchema.safeParse(base).success, false);
  assert.equal(
    briefApprovalSchema.safeParse({ ...base, priority: "urgent" }).success,
    false,
    "a priority alone is not enough to approve",
  );
  assert.equal(
    briefApprovalSchema.safeParse({ ...base, next_step: "standard_queue" }).success,
    false,
    "a next step alone is not enough to approve",
  );
  assert.equal(
    briefApprovalSchema.safeParse({
      ...base,
      priority: "urgent",
      next_step: "standard_queue",
    }).success,
    true,
  );
});

test("a priority the app does not recognise cannot be approved", () => {
  assert.equal(
    briefApprovalSchema.safeParse({
      intent: "approve",
      priority: "critical",
      next_step: "standard_queue",
    }).success,
    false,
  );
  assert.equal(
    briefApprovalSchema.safeParse({
      intent: "approve",
      priority: "urgent",
      next_step: "send_home",
    }).success,
    false,
  );
});
