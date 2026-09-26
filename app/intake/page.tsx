import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import { AppShell } from "@/components/app-shell";
import { IntakeForm } from "@/components/intake-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "New intake" };

export default async function IntakePage() {
  if (!isConfigured()) redirect("/login");
  const { email } = await requireUser();

  return (
    <AppShell email={email}>
      <main id="main" className="mx-auto max-w-3xl px-5 py-10 lg:px-[30px]">
        <Link href="/queue" className="text-sm underline-offset-4 hover:underline">
          &larr; Back to the queue
        </Link>

        <div className="mt-6">
          <p className="text-body-2 text-charcoal">GUIDED INTAKE</p>
          <h1 className="text-h2 mt-3">Record the first account.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-charcoal">
            Take your time. Write what the patient tells you in their own words
            rather than summarising it, and record what you can see. A draft
            brief is organised from these notes for a clinician to review — you
            are not setting a priority here.
          </p>
        </div>

        <div className="mt-10">
          <IntakeForm />
        </div>

        <aside className="mt-12 rounded-[20px] border border-black/15 bg-off-white p-5">
          <p className="text-sm font-semibold">Before you start</p>
          <p className="mt-2 text-sm leading-6 text-charcoal">
            Use the local patient reference only. Do not enter names, dates of
            birth, addresses or contact details, and do not record anything the
            patient has not agreed to share. Once saved, an intake cannot be
            edited — it becomes part of the clinical record.
          </p>
        </aside>
      </main>
    </AppShell>
  );
}
