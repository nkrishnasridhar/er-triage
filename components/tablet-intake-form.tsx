"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { submitTabletEncounter } from "@/app/check-in/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";
import {
  VOICE_ACCOUNT_STORAGE_KEY,
  VOICE_CONCERN_STORAGE_KEY,
} from "@/lib/voice-check-in";

const noSubscription = () => () => undefined;

function useVoiceAccount() {
  return useSyncExternalStore(
    noSubscription,
    () => window.sessionStorage.getItem(VOICE_ACCOUNT_STORAGE_KEY) ?? "",
    () => "",
  );
}

function useVoiceConcern() {
  return useSyncExternalStore(
    noSubscription,
    () => window.sessionStorage.getItem(VOICE_CONCERN_STORAGE_KEY) ?? "",
    () => "",
  );
}

export function TabletIntakeForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(submitTabletEncounter, {});
  const [account, setAccount] = useState("");
  const [accountEdited, setAccountEdited] = useState(false);
  const voiceAccount = useVoiceAccount();
  const voiceConcern = useVoiceConcern();
  const accountValue = accountEdited ? account : voiceAccount;
  const presentingConcern = accountEdited
    ? accountValue.split(/\r?\n/)[1]?.trim() ?? ""
    : voiceConcern;

  if (state.success) {
    return (
      <section aria-live="polite" className="rounded-card bg-surface p-8 text-center shadow-sm">
        <p className="text-body-2 text-muted">CHECK-IN COMPLETE</p>
        <h2 className="text-h2 mt-4">Thank you.</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted">
          Your account has been sent to the clinical team. Please follow the
          instructions from staff.
        </p>
        <Button
          className="mt-8"
          type="button"
          onClick={() => {
            window.sessionStorage.removeItem(VOICE_ACCOUNT_STORAGE_KEY);
            window.sessionStorage.removeItem(VOICE_CONCERN_STORAGE_KEY);
            router.push("/");
          }}
        >
          Start a new check-in
        </Button>
      </section>
    );
  }

  return (
    <form action={action} className="space-y-7 rounded-card bg-surface p-6 shadow-sm sm:p-8">
      <input type="hidden" name="speech_used" value={voiceAccount ? "true" : "false"} />
      {voiceAccount ? (
        <>
          <input type="hidden" name="presenting_concern" value={presentingConcern} />
          <div>
            <label htmlFor="patient_account" className="text-base font-semibold">
              Review your voice answers
            </label>
            <p id="account-help" className="mt-2 text-sm leading-6 text-muted">
              Check and correct the transcript before sending it. Difficulty communicating
              does not change how staff assess you.
            </p>
            <textarea
              id="patient_account"
              name="patient_account"
              value={accountValue}
              onChange={(event) => {
                setAccountEdited(true);
                setAccount(event.target.value);
              }}
              required
              maxLength={4000}
              rows={8}
              aria-describedby="account-help"
              className={`${fieldClass} mt-3 min-h-52 resize-y text-lg leading-7`}
              disabled={pending}
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="patient_reference" className="text-base font-semibold">
              Local patient reference
            </label>
            <p id="reference-help" className="mt-2 text-sm leading-6 text-muted">
              Enter the fictional local record reference. Do not use a name or contact details here.
            </p>
            <input
              id="patient_reference"
              name="patient_reference"
              required
              maxLength={64}
              aria-describedby="reference-help"
              className={`${fieldClass} mt-3 min-h-14 text-lg`}
              disabled={pending}
            />
          </div>
          <fieldset className="space-y-4">
            <legend className="text-base font-semibold">
              What is your name, how old are you, and what is your sex?
            </legend>
            <div>
              <label htmlFor="patient_name" className="text-sm font-medium">Name</label>
              <input id="patient_name" name="patient_name" required maxLength={100} className={`${fieldClass} mt-2 min-h-14 text-lg`} disabled={pending} />
            </div>
            <div>
              <label htmlFor="patient_age" className="text-sm font-medium">Age</label>
              <input id="patient_age" name="patient_age" type="number" min={0} max={130} required className={`${fieldClass} mt-2 min-h-14 text-lg`} disabled={pending} />
            </div>
            <div>
              <label htmlFor="patient_sex" className="text-sm font-medium">Sex</label>
              <input id="patient_sex" name="patient_sex" required maxLength={80} className={`${fieldClass} mt-2 min-h-14 text-lg`} disabled={pending} />
            </div>
          </fieldset>
          <div>
            <label htmlFor="presenting_concern" className="text-base font-semibold">
              What would you like staff to know about why you came in today?
            </label>
            <input id="presenting_concern" name="presenting_concern" required maxLength={200} className={`${fieldClass} mt-3 min-h-14 text-lg`} disabled={pending} />
          </div>
          <div>
            <label htmlFor="when_started" className="text-base font-semibold">When did this start?</label>
            <input id="when_started" name="when_started" required maxLength={500} className={`${fieldClass} mt-3 min-h-14 text-lg`} disabled={pending} />
          </div>
          <div>
            <label htmlFor="what_changed" className="text-base font-semibold">Has it changed since it started?</label>
            <input id="what_changed" name="what_changed" required maxLength={500} className={`${fieldClass} mt-3 min-h-14 text-lg`} disabled={pending} />
          </div>
          <div>
            <label htmlFor="current_symptoms" className="text-base font-semibold">What symptoms are you experiencing right now?</label>
            <textarea id="current_symptoms" name="current_symptoms" required maxLength={1000} rows={3} className={`${fieldClass} mt-3 min-h-28 resize-y text-lg leading-7`} disabled={pending} />
          </div>
          <div>
            <label htmlFor="anything_else" className="text-base font-semibold">
              Is there anything else you’d like staff to know, including medicines, allergies, or health conditions?
            </label>
            <textarea id="anything_else" name="anything_else" required maxLength={1000} rows={4} className={`${fieldClass} mt-3 min-h-32 resize-y text-lg leading-7`} disabled={pending} />
            <p className="mt-2 text-sm leading-6 text-muted">If there is nothing else, enter “Nothing else.” Difficulty communicating does not change how staff assess you.</p>
          </div>
        </>
      )}

      <aside className="rounded-card bg-moss p-4 text-sm leading-6 text-muted">
        Only the text you check and send is shared with the clinical team. This demonstration
        accepts fictional information only.
      </aside>

      <Button type="submit" size="xl" className="min-h-14 w-full text-base" disabled={pending}>
        {pending ? "Sending…" : "Send to the clinical team"}
      </Button>
      <p aria-live="polite" role={state.error ? "alert" : "status"} className="text-sm leading-6">
        {state.error}
      </p>
    </form>
  );
}
