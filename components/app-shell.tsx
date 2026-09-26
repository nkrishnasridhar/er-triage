import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

/**
 * Shared chrome for signed-in pages. `isConfigured` pages redirect to /login
 * themselves, so anything rendered inside this shell already has a session.
 */
export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-[30px]">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/queue" aria-label="ERgency home">
              <BrandMark />
            </Link>
            <nav aria-label="Main" className="flex items-center gap-4 text-sm">
              <Link href="/queue" className="underline-offset-4 hover:underline">
                Active queue
              </Link>
              <Link href="/records" className="underline-offset-4 hover:underline">
                Approved records
              </Link>
            </nav>
          </div>
          <div className="flex min-w-0 items-center gap-4">
            <span className="max-w-48 truncate text-sm text-muted">
              {email}
            </span>
            <form action={signOut}>
              <Button variant="ghost" type="submit">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}

/** The product's core promise, restated wherever a clinical record is shown. */
export function ClinicianDecisionNotice({
  approved,
}: {
  approved: boolean;
}) {
  return (
    <aside className="rounded-card border border-line bg-moss p-5">
      <p className="text-sm font-semibold">
        {approved
          ? "Clinician-reviewed and approved"
          : "Waiting on a clinician decision"}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted">
        {approved
          ? "This record was completed and signed off by a qualified clinician. It is a handover note, not a diagnosis."
          : "Nothing on this page has been prioritised. A clinician must review it, set the priority and the next step, and approve it before it becomes a handover record."}
      </p>
    </aside>
  );
}
