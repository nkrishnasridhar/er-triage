import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import { AppShell, ClinicianDecisionNotice } from "@/components/app-shell";
import { ReviewForm } from "@/components/review-form";
import {
  formatTimestamp,
  nextStepLabel,
  NOT_YET_DECIDED,
  priorityLabel,
} from "@/lib/triage";
import { idSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Triage brief" };

function Lines({ value }: { value: string }) {
  return (
    <ul className="mt-2 space-y-1">
      {value
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => (
          <li key={index} className="text-sm leading-6">
            {line.replace(/^[-*]\s*/, "")}
          </li>
        ))}
    </ul>
  );
}

function Decision({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-lg">{value ?? NOT_YET_DECIDED}</p>
    </div>
  );
}

export default async function EncounterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isConfigured()) redirect("/login");
  const { supabase, email, role } = await requireStaff();

  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const { data: encounter, error: encounterError } = await supabase
    .from("encounters")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (encounterError)
    throw new Error("Could not load this encounter. Check the database connection.");
  if (!encounter) notFound();

  const { data: brief, error: briefError } = await supabase
    .from("triage_briefs")
    .select("*")
    .eq("encounter_id", id)
    .maybeSingle();
  if (briefError)
    throw new Error("Could not load this brief. Check the database connection.");
  if (!brief) notFound();

  const approved = brief.status === "approved";

  return (
    <AppShell email={email} role={role}>
      <main id="main" className="mx-auto max-w-3xl px-5 py-10 lg:px-[30px]">
        <Link href="/queue" className="text-sm underline-offset-4 hover:underline">
          &larr; Back to the queue
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-body-2 text-charcoal">PATIENT REFERENCE</p>
            <h1 className="text-h3 mt-2 break-words">{encounter.patient_reference}</h1>
            <p className="mt-2 text-sm leading-6 text-charcoal">
              {encounter.presenting_concern}
              {encounter.age_years !== null && ` · age ${encounter.age_years}`}
            </p>
          </div>
          <p className="text-sm text-charcoal">
            Captured {formatTimestamp(encounter.created_at)}
              {encounter.submission_source === "tablet"
                ? " from tablet check-in"
                : encounter.recorded_by_label && ` by ${encounter.recorded_by_label}`}
          </p>
        </div>

        <div className="mt-8">
          <ClinicianDecisionNotice approved={approved} />
        </div>

        {approved ? (
          <div className="mt-10 space-y-10">
            <section aria-labelledby="decision" className="rounded-[20px] border border-black/15 p-6">
              <h2 id="decision" className="text-xl font-semibold">
                Clinician decision
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <Decision label="Priority" value={priorityLabel(brief.priority)} />
                <Decision label="Next step" value={nextStepLabel(brief.next_step)} />
              </div>
              <p className="mt-6 border-t border-black/10 pt-4 text-sm leading-6 text-charcoal">
                Approved by {brief.reviewed_by_label} on{" "}
                {formatTimestamp(brief.approved_at)}. This record is now read-only.
              </p>
            </section>

            <section aria-labelledby="handover">
              <h2 id="handover" className="text-xl font-semibold">
                Handover brief
              </h2>
              <div className="mt-4 space-y-6">
                <div>
                  <p className="text-sm font-medium">Summary of the concern</p>
                  <p className="mt-2 text-sm leading-6">{brief.concern_summary}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Items checked by the reviewer</p>
                  <Lines value={brief.items_to_check} />
                </div>
                <div>
                  <p className="text-sm font-medium">Questions outstanding</p>
                  <Lines value={brief.open_questions} />
                </div>
                {brief.clinician_notes && (
                  <div>
                    <p className="text-sm font-medium">Clinician notes</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {brief.clinician_notes}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section aria-labelledby="source">
              <h2 id="source" className="text-xl font-semibold">
                Source capture
              </h2>
              <p className="mt-2 text-sm leading-6 text-charcoal">
                Kept exactly as recorded, for comparison against the brief above.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-medium">In the patient&apos;s words</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">
                    {encounter.patient_account || "Nothing recorded."}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Observed by staff</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">
                    {encounter.observed_signs || "Nothing recorded."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {role === "clinician" ? (
              <ReviewForm brief={brief} />
            ) : (
              <ReadOnlyDraft brief={brief} />
            )}
          </div>
        )}
      </main>
    </AppShell>
  );
}

function ReadOnlyDraft({
  brief,
}: {
  brief: {
    concern_summary: string;
    items_to_check: string;
    open_questions: string;
    clinician_notes: string;
    patient_reported: string;
    staff_observed: string;
  };
}) {
  return (
    <section className="space-y-7" aria-labelledby="read-only-heading">
      <div className="rounded-[20px] border border-black/15 bg-off-white p-5">
        <h2 id="read-only-heading" className="text-lg font-semibold">Read-only report</h2>
        <p className="mt-2 text-sm leading-6 text-charcoal">
          A clinician must review, decide and approve this report. Your role cannot change it.
        </p>
      </div>
      <section>
        <h2 className="text-xl font-semibold">What was captured</h2>
        <p className="mt-4 text-sm font-medium">In the patient&apos;s words</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">{brief.patient_reported || "Nothing recorded."}</p>
        <p className="mt-5 text-sm font-medium">Observed by staff</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">{brief.staff_observed || "Nothing recorded."}</p>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Draft analysis</h2>
        <p className="mt-4 text-sm font-medium">Summary of the concern</p>
        <p className="mt-2 text-sm leading-6">{brief.concern_summary || "Nothing recorded."}</p>
        <p className="mt-5 text-sm font-medium">Items to check</p>
        <Lines value={brief.items_to_check} />
        <p className="mt-5 text-sm font-medium">Open questions</p>
        <Lines value={brief.open_questions} />
      </section>
    </section>
  );
}
