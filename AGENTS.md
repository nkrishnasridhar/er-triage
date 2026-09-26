# ER Triage

Keep this a small, readable foundation. Prefer one complete feature over layers of abstractions.

- Use pnpm, TypeScript strict mode, Next.js App Router and Tailwind v4.
- Keep reads in Server Components; use Server Actions for mutations and small Client Components for interactive forms.
- Validate every action input. Derive ownership from verified authentication, never a submitted user ID.
- Every new public table needs a migration, grants, RLS and a two-account access test.
- Match the tokens in app/globals.css and reuse components/ui. Inter is the only bundled font; do not add unlicensed brand assets.
- Never commit .env.local, database credentials, tokens or private keys. Use public placeholders in .env.example.
- Use only a dedicated local/test database for tests. Never reset a linked/production database.
- Run pnpm lint, pnpm typecheck, pnpm test, pnpm build and, when Docker is available, pnpm test:integration.
- Do not provision paid services or additional production projects without the owner's approval.

## Visual brand system

- The public product name is **Front Brief**. The selected visual direction is **Fieldnote**. The two logo marks in `docs/brand-exploration/selected-logo/` are finalists; do not choose between them without the owner's direction.
- Treat `app/globals.css` as the source of truth for UI tokens. Use the Tailwind colors `paper`, `surface`, `pine`, `muted`, `sage`, `moss`, `clay`, and `line`; do not add ad hoc hex colors or revive the starter blue/black palette.
- Keep screens light and soothing: warm paper page backgrounds, white or pale moss surfaces, pine text, muted secondary text, sage accents, and subtle line borders. **Do not use dark page, panel, or button backgrounds.** Pine is for text and icons; use pale moss with pine text for primary actions.
- Use Inter, which is already bundled. Prefer the existing spacing scale, `rounded-card` for cards, and `rounded-control` for form fields and buttons.
- Keep brand colors separate from clinical meaning. Never use the logo palette to imply urgency, acuity, safety, or disposition; clinical statuses need explicit text labels and their own accessible semantic treatment. Never rely on color alone.
- Reuse `components/ui` and existing CSS tokens. When adding or changing UI, preserve the light Fieldnote system across loading, empty, error, and interaction states as well as the main screen.

## Clinical safety invariants

These are the product, not implementation details. Do not weaken them, and keep
them enforced in the database rather than in application code.

- The application never assigns urgency. `priority` and `next_step` are entered
  by a clinician, and no form may pre-select or default either one.
- A brief cannot be approved without a clinician decision, and a decision cannot
  be recorded without a named reviewer. Both directions are CHECK constraints.
- Approval is one-way. Approved briefs are immutable, including for the reviewer.
- A captured intake is write-once. Never add an UPDATE grant or policy to
  `encounters`, and never add `patient_reported` or `staff_observed` to the
  `triage_briefs` UPDATE grant.
- `lib/draft-brief.ts` is a keyword matcher, not a clinical instrument. It must
  never emit a diagnosis, a severity assessment, a triage category or a
  priority, and it must never present "nothing matched" as reassurance. If you
  replace it with a hosted model, keep the same guarantees and the same
  function signature.
- Never add name, date of birth, address or contact detail to a record.
- Never use real patient data in development, tests or screenshots.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
