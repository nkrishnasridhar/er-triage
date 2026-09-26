"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { submitTabletEncounter } from "@/app/check-in/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";
import { VOICE_ACCOUNT_STORAGE_KEY } from "@/lib/voice-check-in";

const noSubscription = () => () => undefined;

function useVoiceAccount() {
  return useSyncExternalStore(
    noSubscription,
    () => window.sessionStorage.getItem(VOICE_ACCOUNT_STORAGE_KEY) ?? "",
    () => "",
  );
}

export function TabletIntakeForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(submitTabletEncounter, {});
  const [account, setAccount] = useState("");
  const [accountEdited, setAccountEdited] = useState(false);
  const voiceAccount = useVoiceAccount();
  const accountValue = accountEdited ? account : voiceAccount;

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
      <div>
        <label htmlFor="patient_reference" className="text-base font-semibold">
          Local patient reference
        </label>
        <p id="reference-help" className="mt-2 text-sm leading-6 text-muted">
          Do not enter your name, date of birth, address, phone number, or email.
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

      <div>
        <label htmlFor="presenting_concern" className="text-base font-semibold">
          What brings you here today?
        </label>
        <input
          id="presenting_concern"
          name="presenting_concern"
          required
          maxLength={200}
          className={`${fieldClass} mt-3 min-h-14 text-lg`}
          disabled={pending}
        />
      </div>

      <div>
        <label htmlFor="patient_account" className="text-base font-semibold">
          Tell us in your own words
        </label>
        <p id="account-help" className="mt-2 text-sm leading-6 text-muted">
          {voiceAccount
            ? "This is the transcript from your voice check-in. Check and correct it before sending."
            : "Type what you want the clinical team to know."}{" "}
          Difficulty communicating does not change how staff assess you.
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
