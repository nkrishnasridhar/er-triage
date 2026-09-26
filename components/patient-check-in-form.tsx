"use client";

import { useActionState, useMemo, useState } from "react";
import { submitPatientCheckIn } from "@/app/check-in/actions";
import {
  adaptiveQuestionIds,
  BASE_QUESTIONS,
  questionsFor,
  type CheckInQuestion,
} from "@/lib/patient-check-in";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/field";

function Question({
  question,
  value,
  onChange,
  disabled,
}: {
  question: CheckInQuestion;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const inputId = `question-${question.id}`;
  return (
    <div>
      <label htmlFor={inputId} className="text-lg font-medium leading-7">
        {question.prompt}
        {question.required && <span aria-hidden="true"> *</span>}
      </label>
      {question.helper && (
        <p id={`${inputId}-help`} className="mt-2 text-sm leading-6 text-charcoal">
          {question.helper}
        </p>
      )}
      <textarea
        id={inputId}
        rows={4}
        maxLength={1000}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-describedby={question.helper ? `${inputId}-help` : undefined}
        className={`${fieldClass} mt-3 resize-y text-base leading-6`}
      />
    </div>
  );
}

export function PatientCheckInForm() {
  const [state, action, pending] = useActionState(submitPatientCheckIn, {});
  const [step, setStep] = useState<"basics" | "follow-up">("basics");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [localError, setLocalError] = useState("");

  const followUps = useMemo(
    () => questionsFor(adaptiveQuestionIds(answers)),
    [answers],
  );
  const allQuestions = [...BASE_QUESTIONS, ...followUps];
  const sentAnswers = allQuestions
    .map((question) => ({ question_id: question.id, answer: answers[question.id]?.trim() ?? "" }))
    .filter((answer) => answer.answer);

  function updateAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function continueToFollowUps() {
    if (!answers.main_concern?.trim()) {
      setLocalError("Tell us what brought you in before continuing.");
      return;
    }
    setLocalError("");
    setStep("follow-up");
  }

  if (state.checkInCode) {
    return (
      <section className="rounded-[24px] border border-black/15 bg-white p-6 text-center sm:p-10">
        <p className="text-body-2 text-charcoal">CHECK-IN SENT</p>
        <h2 className="text-h2 mt-3">Thank you.</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-charcoal">
          Please show this code to a staff member so they can match your tablet check-in with you.
        </p>
        <p className="mt-7 rounded-xl bg-off-white px-5 py-4 text-2xl font-semibold tracking-[0.12em]">
          {state.checkInCode}
        </p>
        <p className="mt-7 text-sm leading-6 text-charcoal">
          If you feel worse or need help now, please alert a staff member immediately.
        </p>
      </section>
    );
  }

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="answers" value={JSON.stringify(sentAnswers)} />

      <aside className="rounded-[20px] border border-black/15 bg-off-white p-5">
        <p className="font-semibold">This check-in does not diagnose or set your priority.</p>
        <p className="mt-2 text-sm leading-6 text-charcoal">
          Your answers help staff understand your first account. If you feel worse or need help now, please alert a staff member immediately.
        </p>
      </aside>

      {step === "basics" ? (
        <>
          <div className="space-y-8">
            {BASE_QUESTIONS.map((question) => (
              <Question
                key={question.id}
                question={question}
                value={answers[question.id] ?? ""}
                onChange={(value) => updateAnswer(question.id, value)}
                disabled={pending}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button type="button" size="xl" onClick={continueToFollowUps} disabled={pending}>
              Continue
            </Button>
            {localError && <p role="alert" className="text-sm leading-6">{localError}</p>}
          </div>
        </>
      ) : (
        <>
          {followUps.length > 0 && (
            <section aria-labelledby="follow-up-heading" className="space-y-8 border-t border-black/10 pt-8">
              <div>
                <p className="text-body-2 text-charcoal">A FEW MORE QUESTIONS</p>
                <h2 id="follow-up-heading" className="text-h3 mt-2">Help us understand your account.</h2>
                <p className="mt-3 text-sm leading-6 text-charcoal">
                  These questions are chosen from the words you used. You may leave them blank if you are not sure.
                </p>
              </div>
              {followUps.map((question) => (
                <Question
                  key={question.id}
                  question={question}
                  value={answers[question.id] ?? ""}
                  onChange={(value) => updateAnswer(question.id, value)}
                  disabled={pending}
                />
              ))}
            </section>
          )}
          <div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-8">
            <Button type="button" variant="outline" onClick={() => setStep("basics")} disabled={pending}>
              Back
            </Button>
            <Button type="submit" size="xl" disabled={pending}>
              {pending ? "Sending…" : "Send check-in"}
            </Button>
            <p aria-live="polite" role={state.error ? "alert" : "status"} className="text-sm leading-6">
              {state.error}
            </p>
          </div>
        </>
      )}
    </form>
  );
}
