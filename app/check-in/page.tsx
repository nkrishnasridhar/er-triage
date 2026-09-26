import Link from "next/link";
import { TabletIntakeForm } from "@/components/tablet-intake-form";

export default function WrittenCheckInPage() {
  return (
    <main id="main" className="flex min-h-screen flex-col bg-paper text-pine">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <Link href="/" className="text-sm font-semibold underline-offset-4 hover:underline">
          Voice check-in
        </Link>
        <Link href="/login" className="text-sm underline-offset-4 hover:underline">
          Staff sign in
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 sm:px-10">
        <div className="w-full max-w-2xl">
          <p className="text-body-2 mb-5 text-center tracking-[0.12em] text-muted">
            WRITTEN CHECK-IN
          </p>
          <h1 className="text-h2 text-center">Tell us what is happening.</h1>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-7 text-muted">
            Use this form if you prefer to type. You can review every word before you send it.
          </p>
          <div className="mt-8">
            <TabletIntakeForm />
          </div>
        </div>
      </section>
    </main>
  );
}
