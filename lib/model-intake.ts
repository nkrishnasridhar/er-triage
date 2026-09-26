import type { IntakeInput } from "@/lib/draft-brief";

/**
 * The sole representation of an intake sent to either optional model pass.
 * Device snapshots are deliberately absent: they are fictional, unverified
 * demonstration data and must not influence a draft or review suggestion.
 */
export function untrustedIntakeForModel(input: IntakeInput) {
  const escape = (value: string) => value.replaceAll("</untrusted_intake>", "[closing tag removed]");
  return `<untrusted_intake>\nPresenting concern: ${escape(input.presentingConcern)}\nPatient account: ${escape(input.patientAccount)}\nStaff observations: ${escape(input.observedSigns)}\n</untrusted_intake>`;
}
