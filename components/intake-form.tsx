"use client";

import { useActionState } from "react";
import { submitEncounter } from "@/app/encounters/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";

function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}{" "}
      {optional && (
        <span className="font-normal text-charcoal">(optional)</span>
      )}
    </label>
  );
}

function Helper({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm leading-6 text-charcoal">
      {children}
    </p>
  );
}

export function IntakeForm() {
  const [state, action, pending] = useActionState(submitEncounter, {});

  return (
    <form action={action} className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="patient_reference">Patient reference</Label>
          <Helper id="patient_reference-help">
            The local reference your department already uses. Do not enter a
            name, date of birth or contact details here.
          </Helper>
          <input
            id="patient_reference"
            name="patient_reference"
            required
            maxLength={64}
            autoComplete="off"
            placeholder="MRN-004821"
            aria-describedby="patient_reference-help"
            className={`${fieldClass} mt-2`}
            disabled={pending}
          />
        </div>
        <div>
          <Label htmlFor="age_years" optional>
            Age in years
          </Label>
          <Helper id="age_years-help">
            An estimate is fine if that is all the patient gives you.
          </Helper>
          <input
            id="age_years"
            name="age_years"
            type="number"
            inputMode="numeric"
            min={0}
            max={130}
            aria-describedby="age_years-help"
            className={`${fieldClass} mt-2`}
            disabled={pending}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="presenting_concern">Presenting concern</Label>
        <Helper id="presenting_concern-help">
          A few words in the patient&apos;s own words. &ldquo;Chest pain since
          this morning&rdquo; is more useful than &ldquo;cardiac&rdquo;.
        </Helper>
        <input
          id="presenting_concern"
          name="presenting_concern"
          required
          maxLength={200}
          aria-describedby="presenting_concern-help"
          placeholder="What brought them in today?"
          className={`${fieldClass} mt-2`}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="patient_account">The patient&apos;s account</Label>
        <Helper id="patient_account-help">
          What they told you, in their own words. Write it as you heard it,
          including how they describe the pain or how bad it feels. If they
          cannot describe it, write that too — it is useful information.
        </Helper>
        <textarea
          id="patient_account"
          name="patient_account"
          rows={6}
          maxLength={4000}
          aria-describedby="patient_account-help"
          placeholder="Their words, not your interpretation."
          className={`${fieldClass} mt-2 resize-y`}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="observed_signs" optional>
          What you can see and measure
        </Label>
        <Helper id="observed_signs-help">
          Observations and anything visible, such as colour, breathing, alertness
          or any readings you have taken.
        </Helper>
        <textarea
          id="observed_signs"
          name="observed_signs"
          rows={5}
          maxLength={2000}
          aria-describedby="observed_signs-help"
          placeholder="Alert and orientated. Speaking in full sentences. Observations within normal limits."
          className={`${fieldClass} mt-2 resize-y`}
          disabled={pending}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="xl" disabled={pending}>
          {pending ? "Saving…" : "Save intake and draft brief"}
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
