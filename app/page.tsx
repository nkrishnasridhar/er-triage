import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isConfigured } from "@/lib/config";
import { SetupNotice } from "@/components/setup-notice";

const steps = [
  [
    "01",
    "Record the account.",
    "A nurse captures what the patient says in their own words, and what can be seen and measured. No interpretation, no prioritising.",
  ],
  [
    "02",
    "A draft brief appears.",
    "The notes are organised into a scannable brief with the source of every line kept visible, plus anything the notes left unanswered.",
  ],
  [
    "03",
    "A clinician decides.",
    "A qualified clinician reviews the brief, corrects it, sets the priority and the next step, and signs it off. Nothing is queued before that happens.",
  ],
];

export default function Home() {
  return (
    <>
      <header className="grid-container flex items-center justify-between gap-4 py-6">
        <Link href="/" className="font-semibold tracking-tight">
          ER Triage
        </Link>
        <Link
          href="/queue"
          className="text-sm underline-offset-4 hover:underline"
        >
          Staff sign in
        </Link>
      </header>
      <main id="main">
        <section className="grid-container bg-blue py-16 lg:py-24">
          <div className="grid-12 gap-y-10">
            <div className="col-span-12 lg:col-span-8">
              <p className="text-body-2 mb-8">
                EMERGENCY DEPARTMENT INTAKE
              </p>
              <h1 className="text-h1 max-w-4xl">
                The first account,
                <br />
                organised for
                <br />
                the next decision.
              </h1>
            </div>
            <div className="col-span-12 flex flex-col items-start justify-end gap-7 lg:col-span-4">
              <p className="text-body-1 max-w-sm">
                ER Triage turns a patient&apos;s opening account into a
                clinician-reviewed triage brief, so the right information
                reaches the right person sooner.
              </p>
              <Button asChild size="xl">
                <Link href="/queue">
                  Open the queue <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm">
                For emergency department staff. Clinicians only.
              </p>
            </div>
          </div>
        </section>

        <section
          className="grid-container py-12 lg:py-20"
          aria-label="How it works"
        >
          <div className="grid-12 gap-y-5">
            {steps.map(([number, title, body]) => (
              <article
                key={number}
                className="col-span-12 flex min-h-64 flex-col rounded-[20px] bg-off-white p-6 lg:col-span-4 lg:p-8"
              >
                <span className="text-sm text-charcoal">{number}</span>
                <h2 className="text-h3 mt-10">{title}</h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-charcoal">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid-container pb-12 lg:pb-20" aria-label="Limits">
          <div className="rounded-[20px] border border-black/15 p-6 lg:p-8">
            <h2 className="text-h3">What this does not do</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <p className="text-sm leading-6 text-charcoal">
                It does not diagnose, prescribe, or suggest a treatment. It does
                not assign a triage category or rank patients. There is no
                priority on any record until a qualified clinician sets one.
              </p>
              <p className="text-sm leading-6 text-charcoal">
                It supports clinical judgement, it does not replace it. Every
                suggestion can be edited, rejected or ignored, and the approved
                record always names the clinician who signed it off.
              </p>
            </div>
            <p className="mt-6 border-t border-black/10 pt-4 text-sm leading-6 text-charcoal">
              A demonstration built for a hackathon. It is not a medical
              device, it has not been clinically validated, and it must not be
              used with real patients. See{" "}
              <code className="text-sm">PRODUCT_GOAL.md</code> for what would be
              required before any real use.
            </p>
          </div>
        </section>

        {!isConfigured() && (
          <div className="grid-container pb-16">
            <SetupNotice />
          </div>
        )}
      </main>
      <footer className="grid-container flex flex-wrap justify-between gap-4 border-t border-black/10 py-6 text-sm">
        <span>ER Triage — a demonstration, not a medical device.</span>
        <span>Built for a good starting point.</span>
      </footer>
    </>
  );
}
