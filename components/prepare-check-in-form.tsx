"use client";

import { useActionState } from "react";
import { preparePatientCheckIn } from "@/app/check-ins/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";

export function PrepareCheckInForm({
  checkInId,
  initialConcern,
}: {
  checkInId: string;
  initialConcern: string;
}) {
  const [state, action, pending] = useActionState(preparePatientCheckIn, {});
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="check_in_id" value={checkInId} />
      <div>
        <label htmlFor="patient_reference" className="text-sm font-medium">Local patient reference</label>
        <p id="patient_reference-help" className="mt-2 text-sm leading-6 text-charcoal">
          Match the tablet code with your local reference. Do not enter a name, date of birth, address, or contact details.
        </p>
        <input
          id="patient_reference"
          name="patient_reference"
          required
          maxLength={64}
          autoComplete="off"
          aria-describedby="patient_reference-help"
          className={`${fieldClass} mt-2`}
          disabled={pending}
        />
      </div>
      <div>
        <label htmlFor="age_years" className="text-sm font-medium">Age in years <span className="font-normal text-charcoal">(optional)</span></label>
        <input
          id="age_years"
          name="age_years"
          type="number"
          inputMode="numeric"
          min={0}
          max={130}
          className={`${fieldClass} mt-2`}
          disabled={pending}
        />
      </div>
      <div>
        <label htmlFor="presenting_concern" className="text-sm font-medium">Presenting concern</label>
        <p id="presenting_concern-help" className="mt-2 text-sm leading-6 text-charcoal">
          Confirm a short description in the patient&apos;s own words before creating the clinician draft.
        </p>
        <input
          id="presenting_concern"
          name="presenting_concern"
          required
          maxLength={200}
          defaultValue={initialConcern}
          aria-describedby="presenting_concern-help"
          className={`${fieldClass} mt-2`}
          disabled={pending}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="xl" disabled={pending}>
          {pending ? "Preparing…" : "Prepare clinician brief"}
        </Button>
        <p aria-live="polite" role={state.error ? "alert" : "status"} className="text-sm leading-6">
          {state.error}
        </p>
      </div>
    </form>
  );
}
