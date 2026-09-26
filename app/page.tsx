import Link from "next/link";
import { VoiceCheckIn } from "@/components/voice-check-in";

export default function Home() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col bg-paper text-pine"
    >
      <header className="flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <p className="text-sm font-semibold tracking-tight">Christchurch ER</p>
        <Link href="/login" className="text-sm underline-offset-4 hover:underline">
          Staff sign in
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 sm:px-10">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-2 tracking-[0.12em] text-muted">EMERGENCY DEPARTMENT CHECK-IN</p>
            <Link
              href="/check-in"
              className="rounded-control border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-moss"
            >
              Use written form
            </Link>
          </div>
          <h1 className="text-h2 mt-5 text-center">Start by speaking.</h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-7 text-muted">
            The check-in assistant will ask a few questions aloud. You will review and
            confirm the text before anything is sent to the clinical team.
          </p>
          <VoiceCheckIn />
        </div>
      </section>
    </main>
  );
}
