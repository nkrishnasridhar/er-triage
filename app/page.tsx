import Link from "next/link";
import { VoiceCheckIn } from "@/components/voice-check-in";

export default function Home() {
  return (
    <main id="main" className="flex h-dvh min-h-0 flex-col overflow-hidden bg-paper text-pine">
      <header className="flex shrink-0 items-center justify-between px-6 py-4 sm:px-10 sm:py-6">
        <p className="text-sm font-semibold tracking-tight">Front Brief</p>
        <Link href="/login" className="text-sm underline-offset-4 hover:underline">
          Staff sign in
        </Link>
      </header>

      <section className="flex min-h-0 flex-1 items-center justify-center px-6 py-4 sm:px-10">
        <div className="flex max-h-full w-full max-w-2xl flex-col items-center">
          <div className="flex w-full flex-col items-center">
            <p className="text-body-2 text-center tracking-[0.12em] text-muted">
              EMERGENCY DEPARTMENT CHECK-IN
            </p>
          </div>
          <h1 className="text-h2 mt-4 text-center">Start by speaking.</h1>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-7 text-muted">
            The check-in assistant will ask a few questions aloud. You will review and
            confirm the text before anything is sent to the clinical team.
          </p>
          <Link
            href="/check-in"
            className="mt-4 text-sm font-semibold text-pine underline decoration-line underline-offset-4 transition-colors hover:decoration-pine"
          >
            Prefer to type? Use the written form
          </Link>
          <VoiceCheckIn />
        </div>
      </section>
    </main>
  );
}
