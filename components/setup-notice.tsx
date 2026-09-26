export function SetupNotice() {
  return (
    <aside className="rounded-card border border-line bg-moss p-6">
      <h2 className="font-semibold">Connect your Supabase project</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Copy <code>.env.example</code> to <code>.env.local</code>, add your
        project URL and publishable key, then restart your app. Follow the
        README to apply the database migrations and email templates.
      </p>
    </aside>
  );
}
