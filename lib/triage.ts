/**
 * Shared vocabulary for the triage workflow.
 *
 * `priority` and `nextStep` are clinician decisions. This module only holds the
 * words used to offer and display a clinician's choice — it never chooses one,
 * ranks a patient, or derives a default. Departments use different escalation
 * wording, so the labels below are deliberately plain and should be replaced
 * with local policy before any real use.
 */

export type Priority =
  | "immediate"
  | "urgent"
  | "soon"
  | "non_urgent";

export type NextStep =
  | "immediate_escalation"
  | "priority_clinical_review"
  | "standard_queue"
  | "monitor_and_reassess"
  | "discharge_with_advice";

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "immediate", label: "1. Immediate — needs attention now" },
  { value: "urgent", label: "2. Urgent — needs to be seen soon" },
  { value: "soon", label: "3. Soon — needs timely review" },
  { value: "non_urgent", label: "4. Non-urgent — go home" },
];

export const NEXT_STEP_OPTIONS: { value: NextStep; label: string }[] = [
  { value: "immediate_escalation", label: "Escalate immediately" },
  { value: "priority_clinical_review", label: "Priority clinical review" },
  { value: "standard_queue", label: "Standard queue" },
  { value: "monitor_and_reassess", label: "Monitor and reassess" },
  { value: "discharge_with_advice", label: "Discharge with advice" },
];

export const PRIORITY_LABEL = new Map(
  PRIORITY_OPTIONS.map((option) => [option.value, option.label]),
);

// Older approved records may use the former five-level placeholder scale.
// They remain readable but cannot be selected for a new decision: approval is
// immutable, so historical clinician choices must never be rewritten.
const LEGACY_PRIORITY_LABEL = new Map([
  ["very_urgent", "Legacy: Very urgent"],
  ["standard", "Legacy: Standard"],
]);

export const NEXT_STEP_LABEL = new Map(
  NEXT_STEP_OPTIONS.map((option) => [option.value, option.label]),
);

export function priorityLabel(value: string | null) {
  return value
    ? (PRIORITY_LABEL.get(value as Priority) ?? LEGACY_PRIORITY_LABEL.get(value) ?? value)
    : null;
}

export function nextStepLabel(value: string | null) {
  return value ? (NEXT_STEP_LABEL.get(value as NextStep) ?? value) : null;
}

/** Shown wherever a brief is still waiting on a clinician. */
export const NOT_YET_DECIDED = "Not yet decided by a clinician";

export function formatTimestamp(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
