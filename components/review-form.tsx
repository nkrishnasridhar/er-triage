"use client";

import { useActionState } from "react";
import { reviewBrief } from "@/app/encounters/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";
import { NEXT_STEP_OPTIONS, PRIORITY_OPTIONS } from "@/lib/triage";
import type { Tables } from "@/lib/database.types";

type Brief = Tables<"triage_briefs">;

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-2 text-sm leading-6 text-charcoal">
        {value.trim() ? (
          <span className="whitespace-pre-wrap">{value}</span>
        ) : (
          <span className="italic">Nothing was recorded here.</span>
        )}
      </p>
    </div>
  );
}

function Choice({
  name,
  value,
  label,
  pending,
}: {
  name: string;
  value: string;
  label: string;
  pending: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-[20px] border border-black/15 bg-white px-4 py-3 text-base has-[:checked]:border-black has-[:checked]:bg-off-white">
      <input
        type="radio"
        name={name}
        value={value}
        disabled={pending}
        className="size-5 shrink-0 accent-black"
      />
      <span>{label}</span>
    </label>
  );
}

export function ReviewForm({ brief }: { brief: Brief }) {
  const [state, action, pending] = useActionState(reviewBrief, {});

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="brief_id" value={brief.id} />

      {/* What was said and seen. The database does not grant UPDATE on these
          columns, so they cannot be rewritten during review. */}
      <section aria-labelledby="provenance-heading" className="space-y-6">
        <div>
          <h2 id="provenance-heading" className="text-xl font-semibold">
            What was captured
          </h2>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Recorded once at intake and locked. These are the patient&apos;s and
            staff members&apos; own words, not a summary.
          </p>
        </div>
        <ReadOnly label="In the patient's words" value={brief.patient_reported} />
        <ReadOnly label="Observed by staff" value={brief.staff_observed} />
      </section>

      <section aria-labelledby="draft-heading" className="space-y-6">
        <div>
          <h2 id="draft-heading" className="text-xl font-semibold">
            Draft brief
          </h2>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Organised from the text above by matching phrases, nothing more.
            Remove anything that does not apply and add what is missing.
          </p>
        </div>

        <div>
          <label htmlFor="concern_summary" className="text-sm font-medium">
            Summary of the concern
          </label>
          <textarea
            id="concern_summary"
            name="concern_summary"
            rows={2}
            maxLength={600}
            defaultValue={brief.concern_summary}
            className={`${fieldClass} mt-2 resize-y`}
            disabled={pending}
          />
        </div>

        <div>
          <label htmlFor="items_to_check" className="text-sm font-medium">
            Items to check
          </label>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Phrases found in the notes. A phrase is not a finding. Delete
            anything that does not apply to this patient.
          </p>
          <textarea
            id="items_to_check"
            name="items_to_check"
            rows={7}
            maxLength={4000}
            defaultValue={brief.items_to_check}
            className={`${fieldClass} mt-2 resize-y font-mono text-sm`}
            disabled={pending}
          />
        </div>

        <div>
          <label htmlFor="open_questions" className="text-sm font-medium">
            Open questions
          </label>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Gaps found in the notes. Edit freely — you know the patient.
          </p>
          <textarea
            id="open_questions"
            name="open_questions"
            rows={5}
            maxLength={2000}
            defaultValue={brief.open_questions}
            className={`${fieldClass} mt-2 resize-y`}
            disabled={pending}
          />
        </div>

        <div>
          <label htmlFor="clinician_notes" className="text-sm font-medium">
            Your clinical notes
          </label>
          <textarea
            id="clinician_notes"
            name="clinician_notes"
            rows={5}
            maxLength={4000}
            placeholder="Your own assessment and reasoning."
            defaultValue={brief.clinician_notes}
            className={`${fieldClass} mt-2 resize-y`}
            disabled={pending}
          />
        </div>
      </section>

      <section aria-labelledby="decision-heading" className="space-y-6">
        <div>
          <h2 id="decision-heading" className="text-xl font-semibold">
            Your decision
          </h2>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            This application has not suggested a priority and will not pick one
            for you. Both answers are required, and nothing is pre-selected.
          </p>
        </div>

        <fieldset disabled={pending}>
          <legend className="text-sm font-medium">Priority</legend>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Use your department&apos;s own scale. These labels are placeholders
            until local policy is confirmed.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PRIORITY_OPTIONS.map((option) => (
              <Choice
                key={option.value}
                name="priority"
                value={option.value}
                label={option.label}
                pending={pending}
              />
            ))}
          </div>
        </fieldset>

        <fieldset disabled={pending}>
          <legend className="text-sm font-medium">Next step</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {NEXT_STEP_OPTIONS.map((option) => (
              <Choice
                key={option.value}
                name="next_step"
                value={option.value}
                label={option.label}
                pending={pending}
              />
            ))}
          </div>
        </fieldset>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-6">
        <Button type="submit" name="intent" value="save" disabled={pending}>
          {pending ? "Saving…" : "Save draft"}
        </Button>
        <Button
          type="submit"
          name="intent"
          value="approve"
          variant="outline"
          disabled={pending}
        >
          Approve and sign off
        </Button>
        <p
          aria-live="polite"
          role={state.error ? "alert" : "status"}
          className="text-sm leading-6"
        >
          {state.error || state.success}
        </p>
      </div>
    </form>
  );
}
