import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PrepareCheckInForm } from "@/components/prepare-check-in-form";
import { requireUser } from "@/lib/auth";
import { isConfigured } from "@/lib/config";
import {
  BASE_QUESTIONS,
  questionsFor,
  safePatientCheckInAnswers,
  type CheckInQuestion,
} from "@/lib/patient-check-in";
import { formatTimestamp } from "@/lib/triage";
import { idSchema } from "@/lib/validation";

function questionIndex() {
  const questions = [...BASE_QUESTIONS, ...questionsFor([
    "discomfort_location",
    "discomfort_description",
    "breathing_description",
    "injury_how",
    "bleeding_details",
    "neurological_change",
    "medical_context",
  ])];
  return new Map(questions.map((question) => [question.id, question]));
}

export const dynamic = "force-dynamic";
export const metadata = { title: "Patient check-in" };

export default async function PatientCheckInDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isConfigured()) redirect("/login");
  const { supabase, email } = await requireUser();
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  const { data: checkIn, error } = await supabase
    .from("patient_checkins")
    .select("id, check_in_code, presenting_concern, answers, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error("Could not load this patient check-in.");
  if (!checkIn) notFound();

  const { data: encounter } = await supabase
    .from("encounters")
    .select("id")
    .eq("patient_checkin_id", checkIn.id)
    .maybeSingle();
  if (encounter) redirect(`/encounters/${encounter.id}`);

  const answers = safePatientCheckInAnswers(checkIn.answers);
  if (!answers.success) throw new Error("This patient check-in could not be read safely.");
  const questions = questionIndex();

  return (
    <AppShell email={email}>
      <main id="main" className="mx-auto max-w-3xl px-5 py-10 lg:px-[30px]">
        <Link href="/queue" className="text-sm underline-offset-4 hover:underline">&larr; Back to the queue</Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-body-2 text-charcoal">PATIENT TABLET CHECK-IN</p>
            <h1 className="text-h3 mt-2">{checkIn.check_in_code}</h1>
            <p className="mt-2 text-sm leading-6 text-charcoal">Submitted {formatTimestamp(checkIn.created_at)}</p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-charcoal">
            These are patient-entered answers. They are not a diagnosis, priority, or clinician decision.
          </p>
        </div>

        <section aria-labelledby="answers-heading" className="mt-10 rounded-[20px] border border-black/15 p-6">
          <h2 id="answers-heading" className="text-xl font-semibold">What the patient shared</h2>
          <dl className="mt-6 space-y-6">
            {answers.data.map((answer) => {
              const question: CheckInQuestion | undefined = questions.get(answer.question_id);
              return (
                <div key={answer.question_id}>
                  <dt className="text-sm font-medium">{question?.prompt ?? "Patient response"}</dt>
                  <dd className="mt-2 whitespace-pre-wrap text-sm leading-6 text-charcoal">{answer.answer}</dd>
                </div>
              );
            })}
          </dl>
        </section>

        <section aria-labelledby="prepare-heading" className="mt-10">
          <p className="text-body-2 text-charcoal">STAFF STEP</p>
          <h2 id="prepare-heading" className="text-h3 mt-2">Prepare this for clinician review.</h2>
          <p className="mt-3 text-sm leading-6 text-charcoal">
            Match the check-in with the person and confirm the short concern. This creates a draft; it does not assign priority.
          </p>
          <div className="mt-6"><PrepareCheckInForm checkInId={checkIn.id} initialConcern={checkIn.presenting_concern} /></div>
        </section>
      </main>
    </AppShell>
  );
}
