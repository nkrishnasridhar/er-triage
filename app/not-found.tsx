import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="grid-container py-24">
      <p className="text-body-2">404</p>
      <h1 className="text-h2 my-6">No such record.</h1>
      <p className="mb-6 max-w-prose text-sm leading-6 text-muted">
        This intake or brief does not exist, or it is not visible to you.
      </p>
      <Link href="/queue" className="underline">
        Back to the queue
      </Link>
    </main>
  );
}
