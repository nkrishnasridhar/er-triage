import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/triage";
import {
  compareSuggestedReviewOrder,
  REVIEW_BAND_LABEL,
  type ReviewBand,
} from "@/lib/review-recommendation-validation";
import type { Tables } from "@/lib/database.types";

export const dynamic = "force-dynamic";
export const metadata = { title: "Queue" };

export default async function QueuePage() {
  if (!isConfigured()) redirect("/login");
  const { supabase, email } = await requireStaff();

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

  type ReviewSuggestion = Pick<
    Tables<"review_suggestions">,
    "encounter_id" | "attention_band" | "rank_score"
  >;
  const { data: suggestions, error: suggestionsError } = ids.length
    ? await supabase
        .from("review_suggestions")
        .select("encounter_id, attention_band, rank_score")
        .in("encounter_id", ids)
    : { data: [], error: null };
  if (suggestionsError)
    throw new Error("Could not load review suggestions for this queue.");

  const briefByEncounter = new Map((briefs as BriefSummary[]).map((brief) => [brief.encounter_id, brief]));
  const suggestionByEncounter = new Map(
    (suggestions as ReviewSuggestion[]).map((suggestion) => [suggestion.encounter_id, suggestion]),
  );
  const awaiting = rows
    .filter((row) => briefByEncounter.get(row.id)?.status !== "approved")
    .sort((left, right) =>
      compareSuggestedReviewOrder(
        {
          rankScore: suggestionByEncounter.get(left.id)?.rank_score ?? -1,
          createdAt: left.created_at,
        },
        {
          rankScore: suggestionByEncounter.get(right.id)?.rank_score ?? -1,
          createdAt: right.created_at,
        },
      ),
    );
  const approvedCount = rows.length - awaiting.length;

  return (
    <AppShell email={email}>
      <main id="main" className="mx-auto max-w-5xl px-5 py-10 lg:px-[30px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-body-2 text-muted">SUGGESTED CLINICIAN REVIEW ORDER</p>
            <h1 className="text-h2 mt-3">Start with a suggestion. Open any report.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Every report remains available. This order is a source-linked review suggestion, not a clinical priority or decision.
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
              {awaiting.map((row, index) => {
                const suggestion = suggestionByEncounter.get(row.id);
                const band = (suggestion?.attention_band ?? "unassessed") as ReviewBand;
                return (
                  <li key={row.id}>
                    <Link
                      href={`/encounters/${row.id}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5 transition-colors hover:bg-moss"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-pine">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="break-words font-semibold">{row.patient_reference}</p>
                          <p className="mt-1 break-words text-sm leading-6 text-muted">
                            {row.presenting_concern}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            {formatTimestamp(row.created_at)}
                            {row.recorded_by_label && ` · captured by ${row.recorded_by_label}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted">
                        <p>{REVIEW_BAND_LABEL[band]}</p>
                        <p className="mt-1">Open to review</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </AppShell>
  );
}
