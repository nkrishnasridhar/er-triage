"use client";

import { Mic, MicOff } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitTabletEncounter } from "@/app/check-in/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";

type RecognitionResultEvent = Event & {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};
type RecognitionErrorEvent = Event & { error: string };
type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};
type RecognitionConstructor = new () => Recognition;

function getRecognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const candidate = window as typeof window & {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  };
  return candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition ?? null;
}

export function TabletIntakeForm() {
  const [state, action, pending] = useActionState(submitTabletEncounter, {});
  const [account, setAccount] = useState("");
  const [speechState, setSpeechState] = useState<
    "unsupported" | "ready" | "listening" | "error"
  >("ready");
  const [speechUsed, setSpeechUsed] = useState(false);
  const recognition = useRef<Recognition | null>(null);

  useEffect(() => () => recognition.current?.stop(), []);

  function startSpeech() {
    const Constructor = getRecognitionConstructor();
    if (!Constructor) {
      setSpeechState("unsupported");
      return;
    }
    const instance = new Constructor();
    recognition.current = instance;
    instance.continuous = true;
    instance.interimResults = false;
    instance.lang = "en-NZ";
    instance.onresult = (event) => {
      let recognised = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        recognised += event.results[index][0]?.transcript ?? "";
      }
      if (recognised.trim()) {
        setAccount((current) => `${current}${current.trim() ? " " : ""}${recognised.trim()}`);
        setSpeechUsed(true);
      }
    };
    instance.onerror = () => setSpeechState("error");
    instance.onend = () => setSpeechState((current) => (current === "error" ? current : "ready"));
    setSpeechState("listening");
    instance.start();
  }

  function stopSpeech() {
    recognition.current?.stop();
    recognition.current = null;
    setSpeechState("ready");
  }

  if (state.success) {
    return (
      <section aria-live="polite" className="rounded-[28px] bg-white p-8 text-center shadow-sm">
        <p className="text-body-2 text-charcoal">CHECK-IN COMPLETE</p>
        <h2 className="text-h2 mt-4">Thank you.</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-charcoal">
          Your account has been sent to the clinical team. Please follow the
          instructions from staff.
        </p>
        <Button className="mt-8" type="button" onClick={() => window.location.reload()}>
          Start a new check-in
        </Button>
      </section>
    );
  }

  return (
    <form action={action} className="space-y-7 rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
      <input type="hidden" name="speech_used" value={speechUsed ? "true" : "false"} />
      <div>
        <label htmlFor="patient_reference" className="text-base font-semibold">
          Local patient reference
        </label>
        <p id="reference-help" className="mt-2 text-sm leading-6 text-charcoal">
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label htmlFor="patient_account" className="text-base font-semibold">
            Tell us in your own words
          </label>
          {speechState !== "unsupported" && (
            <Button
              type="button"
              variant={speechState === "listening" ? "secondary" : "outline"}
              size="lg"
              onClick={speechState === "listening" ? stopSpeech : startSpeech}
              disabled={pending}
            >
              {speechState === "listening" ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
              {speechState === "listening" ? "Stop listening" : "Speak instead"}
            </Button>
          )}
        </div>
        <p id="account-help" className="mt-2 text-sm leading-6 text-charcoal">
          You can type or speak, then check and correct the text before sending.
          Difficulty communicating does not change how staff assess you.
        </p>
        {speechState === "unsupported" && (
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Speech input is not available in this browser. You can still type your account.
          </p>
        )}
        {speechState === "error" && (
          <p role="alert" className="mt-2 text-sm leading-6 text-charcoal">
            Speech input stopped. Check the text below or continue by typing.
          </p>
        )}
        <textarea
          id="patient_account"
          name="patient_account"
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          required
          maxLength={4000}
          rows={8}
          aria-describedby="account-help"
          className={`${fieldClass} mt-3 min-h-52 resize-y text-lg leading-7`}
          disabled={pending}
        />
      </div>

      <aside className="rounded-[20px] bg-off-white p-4 text-sm leading-6 text-charcoal">
        We do not store audio. Only the text you check and send is shared with the clinical team.
        This demonstration accepts fictional information only.
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
