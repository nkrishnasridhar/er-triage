import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col bg-off-white text-black"
    >
      <header className="flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8">
        <p className="text-sm font-semibold tracking-tight">ER Triage</p>
        <Link href="/login" className="text-sm underline-offset-4 hover:underline">
          Staff sign in
        </Link>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 pb-20 text-center sm:px-10">
        <div className="flex max-w-xl flex-col items-center">
          <p className="text-body-2 mb-5 tracking-[0.12em] text-charcoal">EMERGENCY DEPARTMENT CHECK-IN</p>
          <h1 className="text-h1">Start your check-in.</h1>
          <p className="text-body-1 mt-6 max-w-md text-charcoal">
            Tell the team what brought you in before you speak with a clinician.
          </p>
          <Button asChild size="xl" className="mt-12">
            <Link href="/check-in">
              Begin check-in <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <p className="mt-6 max-w-md text-sm leading-6 text-charcoal">
            If you feel worse or need help now, please alert a staff member immediately.
          </p>
        </div>
      </section>
    </main>
  );
}
