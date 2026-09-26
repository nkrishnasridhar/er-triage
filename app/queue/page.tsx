import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/triage";
import type { Tables } from "@/lib/database.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Queue" };

export default async function QueuePage() {
  if (!isConfigured()) redirect("/login");
  const { supabase, email, role } = await requireStaff();

  const { data: encounters, error } = await supabase
    .from("encounters")
    .select("id, patient_reference, presenting_concern, created_at, recorded_by_label")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Could not load the queue. Check the database connection.");

  const rows = encounters ?? [];
  const ids = rows.map((row) => row.id);
  type BriefSummary = Pick<Tables<"triage_briefs">, "encounter_id" | "status">;
  const { data: briefs, error: briefsError } = ids.length
    ? await supabase.from("triage_briefs").select("encounter_id, status").in("encounter_id", ids)
    : { data: [], error: null };
  if (briefsError) throw new Error("Could not load the briefs for this queue.");

  const briefByEncounter = new Map((briefs as BriefSummary[]).map((brief) => [brief.encounter_id, brief]));
  const awaiting = rows.filter((row) => briefByEncounter.get(row.id)?.status !== "approved");
  const approvedCount = rows.length - awaiting.length;

  return (
    <AppShell email={email} role={role}>
      <main id="main" className="mx-auto max-w-5xl px-5 py-10 lg:px-[30px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-body-2 text-muted">SHARED DEPARTMENT QUEUE</p>
            <h1 className="text-h2 mt-3">Waiting on a clinician.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Tablet accounts arrive in capture order. Nothing here carries a priority until a qualified clinician records one.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="xl" variant="outline">
              <Link href="/records">Approved records ({approvedCount})</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/">
                Open tablet check-in <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {awaiting.length === 0 ? (
          <div className="mt-10 rounded-card border border-dashed border-line px-6 py-14">
            <p className="text-h3">Nothing is waiting.</p>
            <p className="mt-4 text-sm leading-6 text-muted">
              New tablet accounts will appear here for clinician review. Approved handovers are kept in the records archive.
            </p>
          </div>
        ) : (
          <section className="mt-12" aria-labelledby="awaiting-heading">
            <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
              <h2 id="awaiting-heading" className="text-lg font-semibold">
                Awaiting review
              </h2>
              <span className="rounded-full bg-moss px-3 py-1 text-sm">{awaiting.length}</span>
            </div>
            <ul className="space-y-3">
              {awaiting.map((row) => (
                <li key={row.id}>
                  <Link
                    href={`/encounters/${row.id}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5 transition-colors hover:bg-moss"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{row.patient_reference}</p>
                      <p className="mt-1 break-words text-sm leading-6 text-muted">{row.presenting_concern}</p>
                      <p className="mt-1 text-sm text-muted">
                        {formatTimestamp(row.created_at)}
                        {row.recorded_by_label && ` · captured by ${row.recorded_by_label}`}
                      </p>
                    </div>
                    <p className="text-right text-sm text-muted">Awaiting clinician review</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </AppShell>
  );
}
