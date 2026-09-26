"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="mx-auto max-w-xl px-5 py-24">
      <h1 className="text-h2">Something didn’t load.</h1>
      <p className="my-6 text-sm leading-6 text-muted">
        This record could not be loaded. Please try again. If you are running
        the app locally, check your Supabase connection and that the triage
        migration has been applied.
      </p>
      <Button onClick={reset}>Try again</Button>
      <Link href="/" className="ml-5 text-sm underline">
        Go home
      </Link>
    </main>
  );
}
