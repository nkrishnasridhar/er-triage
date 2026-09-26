import Link from "next/link";
import { PatientCheckInForm } from "@/components/patient-check-in-form";
import { SetupNotice } from "@/components/setup-notice";
import { isConfigured } from "@/lib/config";

export const metadata = { title: "Patient check-in" };

export default function PatientCheckInPage() {
  const configured = isConfigured();

  return (
    <main id="main" className="min-h-screen bg-off-white px-5 py-6 sm:px-10 sm:py-8">
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <Link href="/" className="font-semibold">ER Triage</Link>
        <Link href="/login" className="text-sm underline-offset-4 hover:underline">Staff sign in</Link>
      </header>
      <div className="mx-auto max-w-3xl py-12 sm:py-16">
        <p className="text-body-2 text-charcoal">EMERGENCY DEPARTMENT CHECK-IN</p>
        <h1 className="text-h2 mt-3">Tell the team what brought you in.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-charcoal">
          Answer in your own words. This tablet helps staff prepare for your conversation; it does not diagnose you or decide who is seen first.
        </p>
        <div className="mt-10">{configured ? <PatientCheckInForm /> : <SetupNotice />}</div>
        <p className="mt-10 text-sm leading-6 text-charcoal">
          Demonstration only. Do not enter a name, date of birth, address, contact details, or real health information.
        </p>
      </div>
    </main>
  );
}
