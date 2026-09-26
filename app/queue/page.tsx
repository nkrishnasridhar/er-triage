import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  formatTimestamp,
  nextStepLabel,
  NOT_YET_DECIDED,
  priorityLabel,
} from "@/lib/triage";
import type { Tables } from "@/lib/database.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Queue" };

export default async function QueuePage() {
  if (!isConfigured()) redirect("/login");
  const { supabase, email } = await requireUser();

  const { data: encounters, error } = await supabase
    .from("encounters")
    .select("id, patient_reference, presenting_concern, created_at, recorded_by_label")
    .order("created_at", { ascending: false });

  if (error)
    throw new Error(
      "Could not load the queue. Check the connection and database migration.",
    );

  const rows = encounters ?? [];

  // Joined here rather than with a nested select, so the brief is an ordinary
  // typed row rather than a shape the client has to infer.
  const ids = rows.map((row) => row.id);
  type BriefSummary = Pick<
    Tables<"triage_briefs">,
    "encounter_id" | "status" | "priority" | "next_step"
  >;
  let briefs: BriefSummary[] = [];
  if (ids.length) {
    // Joined here rather than with a nested select, so the brief is an ordinary
    // typed row rather than a shape the client has to infer.
    const { data, error } = await supabase
      .from("triage_briefs")
      .select("encounter_id, status, priority, next_step")
      .in("encounter_id", ids);
    if (error) throw new Error("Could not load the briefs for this queue.");
    briefs = data ?? [];
  }

  const briefByEncounter = new Map(briefs.map((brief) => [brief.encounter_id, brief]));
  const statusOf = (id: string) => briefByEncounter.get(id)?.status ?? "draft";
  const awaiting = rows.filter((row) => statusOf(row.id) === "draft");
  const approved = rows.filter((row) => statusOf(row.id) === "approved");

  return (
    <AppShell email={email}>
      <main id="main" className="mx-auto max-w-5xl px-5 py-10 lg:px-[30px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-body-2 text-charcoal">SHARED DEPARTMENT QUEUE</p>
            <h1 className="text-h2 mt-3">Waiting on a clinician.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-charcoal">
              Every intake in this department is visible to every member of
              staff. Nothing here carries a priority until a qualified clinician
              sets one.
            </p>
          </div>
          <Button asChild size="xl">
            <Link href="/intake">
              New intake <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {rows.length === 0 ? (
          <div className="mt-10 rounded-[20px] border border-dashed border-black/20 px-6 py-14">
            <p className="text-h3">No intakes yet.</p>
            <p className="mt-4 text-sm leading-6 text-charcoal">
              Record a patient&apos;s first account and a draft brief will be
              prepared for a clinician to review.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            <section aria-labelledby="awaiting-heading">
              <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
                <h2 id="awaiting-heading" className="text-lg font-semibold">
                  Awaiting review
                </h2>
                <span className="rounded-full bg-off-white px-3 py-1 text-sm">
                  {awaiting.length}
                </span>
              </div>
              {awaiting.length === 0 ? (
                <p className="text-sm leading-6 text-charcoal">
                  Nothing is waiting. Every brief has been signed off.
                </p>
              ) : (
                <ul className="space-y-3">
                  {awaiting.map((row) => (
                    <li key={row.id}>
                      <QueueRow
                        id={row.id}
                        reference={row.patient_reference}
                        concern={row.presenting_concern}
                        createdAt={row.created_at}
                        recordedBy={row.recorded_by_label}
                        priority={null}
                        nextStep={null}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section aria-labelledby="approved-heading">
              <div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4">
                <h2 id="approved-heading" className="text-lg font-semibold">
                  Approved handover records
                </h2>
                <span className="rounded-full bg-off-white px-3 py-1 text-sm">
                  {approved.length}
                </span>
              </div>
              {approved.length === 0 ? (
                <p className="text-sm leading-6 text-charcoal">
                  No approved records yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {approved.map((row) => {
                    const brief = briefByEncounter.get(row.id);
                    return (
                      <li key={row.id}>
                        <QueueRow
                          id={row.id}
                          reference={row.patient_reference}
                          concern={row.presenting_concern}
                          createdAt={row.created_at}
                          recordedBy={row.recorded_by_label}
                          priority={brief?.priority ?? null}
                          nextStep={brief?.next_step ?? null}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </AppShell>
  );
}

function QueueRow({
  id,
  reference,
  concern,
  createdAt,
  recordedBy,
  priority,
  nextStep,
}: {
  id: string;
  reference: string;
  concern: string;
  createdAt: string;
  recordedBy: string;
  priority: string | null;
  nextStep: string | null;
}) {
  const decided = priority !== null;
  return (
    <Link
      href={`/encounters/${id}`}
      className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-black/10 p-5 transition-colors hover:bg-off-white"
    >
      <div className="min-w-0">
        <p className="break-words font-semibold">{reference}</p>
        <p className="mt-1 break-words text-sm leading-6 text-charcoal">{concern}</p>
        <p className="mt-1 text-sm text-charcoal">
          {formatTimestamp(createdAt)}
          {recordedBy && ` · captured by ${recordedBy}`}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">
          {decided ? priorityLabel(priority) : "Not yet decided"}
        </p>
        <p className="mt-1 text-sm text-charcoal">
          {decided ? nextStepLabel(nextStep) : NOT_YET_DECIDED}
        </p>
      </div>
    </Link>
  );
}
