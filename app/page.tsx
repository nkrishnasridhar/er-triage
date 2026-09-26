import { VoiceCheckIn } from "@/components/voice-check-in";

export default function Home() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col bg-off-white text-black"
    >
      <header className="px-6 py-6 sm:px-10 sm:py-8">
        <p className="text-sm font-semibold tracking-tight">Christchurch ER</p>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 pb-20 text-center sm:px-10">
        <div className="flex max-w-xl flex-col items-center">
          <p className="text-body-2 mb-5 tracking-[0.12em] text-charcoal">
            EMERGENCY DEPARTMENT CHECK-IN
          </p>
          <h1 className="text-h1">Welcome to Christchurch ER</h1>
          <p className="text-body-1 mt-6 max-w-md text-charcoal">
            How can we help today?
          </p>

          <VoiceCheckIn />
        </div>
      </section>
    </main>
  );
}
