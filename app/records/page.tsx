import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { requireStaff } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import { formatTimestamp, nextStepLabel, priorityLabel } from "@/lib/triage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Approved records" };

export default async function ApprovedRecordsPage() {
  if (!isConfigured()) redirect("/login");
  const { supabase, email, role } = await requireStaff();

  const { data: briefs, error: briefsError } = await supabase
    .from("triage_briefs")
    .select("encounter_id, priority, next_step, approved_at")
    .eq("status", "approved")
    .order("approved_at", { ascending: false });
  if (briefsError) throw new Error("Could not load approved records.");

  const approvedBriefs = briefs ?? [];
  const ids = approvedBriefs.map((brief) => brief.encounter_id);
  const { data: encounters, error: encountersError } = ids.length
    ? await supabase
        .from("encounters")
        .select("id, patient_reference, presenting_concern, recorded_by_label")
        .in("id", ids)
    : { data: [], error: null };
  if (encountersError) throw new Error("Could not load approved record details.");

  const encounterById = new Map((encounters ?? []).map((encounter) => [encounter.id, encounter]));

  return (
    <AppShell email={email} role={role}>
      <main id="main" className="mx-auto max-w-5xl px-5 py-10 lg:px-[30px]">
        <Link href="/queue" className="text-sm underline-offset-4 hover:underline">
          &larr; Back to the active queue
        </Link>
        <div className="mt-6">
          <p className="text-body-2 text-muted">DEPARTMENT RECORDS</p>
          <h1 className="text-h2 mt-3">Approved handover records.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            These completed records are read-only and are kept separately from the active clinician queue.
          </p>
        </div>

        {approvedBriefs.length === 0 ? (
          <div className="mt-10 rounded-card border border-dashed border-line px-6 py-14">
            <p className="text-h3">No approved records yet.</p>
            <p className="mt-4 text-sm leading-6 text-muted">
              Records appear here after a clinician has made and approved a decision.
            </p>
          </div>
        ) : (
          <ul className="mt-12 space-y-3">
            {approvedBriefs.flatMap((brief) => {
              const encounter = encounterById.get(brief.encounter_id);
              if (!encounter) return [];
              return (
                <li key={brief.encounter_id}>
                  <Link
                    href={`/encounters/${brief.encounter_id}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5 transition-colors hover:bg-moss"
                  >
                    <div className="min-w-0">
                      <p className="break-words font-semibold">{encounter.patient_reference}</p>
                      <p className="mt-1 break-words text-sm leading-6 text-muted">{encounter.presenting_concern}</p>
                      <p className="mt-1 text-sm text-muted">
                        Approved {formatTimestamp(brief.approved_at)}
                        {encounter.recorded_by_label && ` · captured by ${encounter.recorded_by_label}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{priorityLabel(brief.priority)}</p>
                      <p className="mt-1 text-sm text-muted">{nextStepLabel(brief.next_step)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </AppShell>
  );
}
