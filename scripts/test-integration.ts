/** Local-only, real Supabase + HTTP smoke test. Never accepts a remote project. */
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { createClient } from "@supabase/supabase-js";
import { load } from "cheerio";

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const pnpmShell = process.platform === "win32";

/** React escapes quotes even inside textarea content, so compare on plain text. */
function plainText(html: string) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function main() {
  const local = JSON.parse(
    execFileSync(pnpmCommand, ["supabase", "status", "-o", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      shell: pnpmShell,
    }),
  );
  assert.equal(
    new URL(local.API_URL).hostname,
    "127.0.0.1",
    "Only the local Supabase stack is allowed",
  );
  assert.equal(
    new URL(local.API_URL).port,
    "55431",
    "Use this starter's isolated test stack",
  );
  const key = local.PUBLISHABLE_KEY || local.ANON_KEY;
  const admin = createClient(local.API_URL, local.SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const publicClient = () =>
    createClient(local.API_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  const alice = publicClient();
  const bob = publicClient();
  const anonymous = publicClient();
  const userIds: string[] = [];
  const encounterIds: string[] = [];
  const run = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const aliceEmail = `alice-${run}@example.test`;
  const bobEmail = `bob-${run}@example.test`;
  const password = `local-only-${run}-Password1!`;
  let server: ReturnType<typeof spawn> | undefined;
  try {
    for (const [client, email] of [
      [alice, aliceEmail],
      [bob, bobEmail],
    ] as const) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      assert.equal(error, null);
      userIds.push(data.user!.id);
      assert.equal(
        (await client.auth.signInWithPassword({ email, password })).error,
        null,
      );
    }

    // ---- The queue is shared, but writing is not. -----------------------------
    const { data: record, error } = await alice
      .from("encounters")
      .insert({
        patient_reference: "MRN-TEST-1",
        presenting_concern: "Chest pain since this morning",
        patient_account: "Heavy chest pain and sweating since this morning.",
        observed_signs: "Speaking in short sentences.",
        recorded_by: userIds[0],
        recorded_by_label: aliceEmail,
      })
      .select()
      .single();
    assert.equal(error, null);
    encounterIds.push(record.id);

    // The department queue is shared, so the other account can read it...
    assert.equal(
      (await bob.from("encounters").select().eq("id", record.id)).data?.length,
      1,
    );
    // ...but cannot rewrite it: a captured intake is write-once.
    assert.ok(
      (
        await bob
          .from("encounters")
          .update({ presenting_concern: "Rewritten" })
          .eq("id", record.id)
      ).error,
      "a captured intake is immutable for everyone",
    );

    // Nobody anonymous gets in.
    assert.ok(
      (await anonymous.from("encounters").select()).error,
      "Anonymous reads are denied",
    );
    assert.ok(
      (
        await anonymous
          .from("encounters")
          .insert({ patient_reference: "X", presenting_concern: "X", recorded_by: userIds[0] })
      ).error,
    );
    // Ownership is derived from the verified session, not from a submitted id.
    assert.ok(
      (
        await bob
          .from("encounters")
          .insert({
            patient_reference: "Forged",
            presenting_concern: "Forged owner",
            recorded_by: userIds[0],
          })
      ).error,
    );

    // ---- The brief: the app cannot decide urgency. ---------------------------
    const { data: brief, error: briefError } = await alice
      .from("triage_briefs")
      .insert({
        encounter_id: record.id,
        drafted_by: userIds[0],
        concern_summary: "Chest pain since this morning",
        patient_reported: record.patient_account,
        staff_observed: record.observed_signs,
        items_to_check: '- Patient reported: "chest pain" — matched in the recorded text.',
        open_questions: "- Onset and duration were not evident in the notes.",
      })
      .select()
      .single();
    assert.equal(briefError, null);

    // A brief cannot be born approved. Forcing status at insert means the only
    // route to an approved record is the update path, which needs a real row.
    assert.ok(
      (
        await alice.from("triage_briefs").insert({
          encounter_id: record.id,
          drafted_by: userIds[0],
          status: "approved",
          priority: "non_urgent",
          next_step: "discharge_with_advice",
          reviewed_by: userIds[0],
          reviewed_by_label: aliceEmail,
          approved_at: new Date().toISOString(),
        })
      ).error,
      "a brief cannot be inserted already approved",
    );

    // A brief cannot be approved without a clinician decision attached.
    assert.ok(
      (
        await alice
          .from("triage_briefs")
          .update({ status: "approved" })
          .eq("id", brief.id)
      ).error,
      "approval without a priority, next step, reviewer and timestamp is refused",
    );
    // Nor can a priority be recorded without the rest of a decision.
    assert.ok(
      (
        await alice
          .from("triage_briefs")
          .update({ priority: "immediate" })
          .eq("id", brief.id)
      ).error,
      "a priority cannot be set on an undecided brief",
    );
    // Nor can a priority be invented.
    assert.ok(
      (
        await alice
          .from("triage_briefs")
          .update({
            status: "approved",
            priority: "definitely_fine",
            next_step: "standard_queue",
            reviewed_by: userIds[0],
            approved_at: new Date().toISOString(),
          })
          .eq("id", brief.id)
      ).error,
      "an unrecognised priority is refused",
    );

    // What the patient said cannot be rewritten during review. patient_reported
    // is absent from the UPDATE grant, so this is refused outright; the data is
    // asserted too, since that is the property that actually matters.
    const lockedAttempt = await bob
      .from("triage_briefs")
      .update({ patient_reported: "Rewritten by a reviewer" })
      .eq("id", brief.id);
    assert.ok(
      lockedAttempt.error || (lockedAttempt.data ?? []).length === 0,
      "the patient's own words are locked once captured",
    );
    assert.equal(
      (await bob.from("triage_briefs").select().eq("id", brief.id)).data?.[0]
        .patient_reported,
      record.patient_account,
    );

    // A second clinician can pick up a draft brief and approve it.
    const approvedAt = new Date().toISOString();
    const { error: approveError } = await bob
      .from("triage_briefs")
      .update({
        clinician_notes: "Reviewed. Escalate to the resuscitation team.",
        priority: "immediate",
        next_step: "immediate_escalation",
        status: "approved",
        reviewed_by: userIds[1],
        reviewed_by_label: bobEmail,
        approved_at: approvedAt,
      })
      .eq("id", brief.id)
      .eq("status", "draft");
    assert.equal(approveError, null);
    const approved = (
      await bob.from("triage_briefs").select().eq("id", brief.id).single()
    ).data!;
    assert.equal(approved.status, "approved");
    assert.equal(approved.priority, "immediate");
    assert.equal(approved.reviewed_by, userIds[1]);

    // Approval is one-way. An approved row must be unchanged afterwards, by
    // anyone. Note that an UPDATE the RLS policy filters out matches zero rows
    // and is reported as success with no error, so the assertion is on the data
    // rather than on the presence of an error.
    const readBrief = async () =>
      (
        await admin.from("triage_briefs").select("*").eq("id", brief.id).single()
      ).data!;
    const snapshot = await readBrief();
    for (const [client, who] of [
      [alice, "the author"],
      [bob, "the reviewer"],
    ] as const) {
      await client
        .from("triage_briefs")
        .update({ clinician_notes: "Quietly changed" })
        .eq("id", brief.id);
      assert.deepEqual(
        await readBrief(),
        snapshot,
        `an approved record is immutable, including for ${who}`,
      );
    }

    // The drafter cannot be reassigned to someone else either.
    await alice
      .from("triage_briefs")
      .update({ drafted_by: userIds[1] })
      .eq("id", brief.id);
    assert.equal(
      (
        await admin.from("triage_briefs")
          .select("drafted_by")
          .eq("id", brief.id)
          .single()
      ).data!.drafted_by,
      userIds[0],
      "the drafter is immutable",
    );

    // Database-level validation, mirroring lib/validation.ts.
    assert.ok(
      (
        await alice.from("encounters").insert({
          patient_reference: "   ",
          presenting_concern: "Blank reference",
          recorded_by: userIds[0],
        })
      ).error,
    );
    assert.ok(
      (
        await alice.from("encounters").insert({
          patient_reference: "MRN-TEST-2",
          presenting_concern: "x".repeat(201),
          recorded_by: userIds[0],
        })
      ).error,
    );
    assert.ok(
      (
        await alice.from("encounters").insert({
          patient_reference: "MRN-TEST-3",
          presenting_concern: "Too old",
          recorded_by: userIds[0],
          age_years: 900,
        })
      ).error,
    );

    console.log(
      "PASS: shared queue, write-once intake, anonymous denial, cross-account isolation, locked provenance, approval requires a clinician decision, one-way approval",
    );

    // Clear the direct-database records so the HTTP section starts from a
    // genuinely empty department queue.
    await admin.from("triage_briefs").delete().eq("encounter_id", record.id);
    await admin.from("encounters").delete().eq("id", record.id);

    // ---- The real HTTP workflow. ---------------------------------------------
    const env = {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: local.API_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
    };
    execFileSync(pnpmCommand, ["build"], { env, stdio: "pipe", shell: pnpmShell });
    const portProbe = createServer();
    portProbe.listen(0, "127.0.0.1");
    await once(portProbe, "listening");
    const address = portProbe.address();
    assert.ok(address && typeof address === "object");
    const port = address.port;
    await new Promise<void>((resolve) => portProbe.close(() => resolve()));
    server = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(port),
      ],
      { env, stdio: "ignore" },
    );
    const origin = `http://127.0.0.1:${port}`;
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch(origin)).ok) break;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    const cookies = new Map<string, string>();
    async function request(path: string, init: RequestInit = {}) {
      const response = await fetch(`${origin}${path}`, {
        ...init,
        redirect: "manual",
        headers: {
          Cookie: [...cookies]
            .map(([name, value]) => `${name}=${value}`)
            .join("; "),
          Origin: origin,
          ...init.headers,
        },
      });
      for (const cookie of response.headers.getSetCookie()) {
        const [part] = cookie.split(";");
        const i = part.indexOf("=");
        cookies.set(part.slice(0, i), part.slice(i + 1));
      }
      return response;
    }
    async function submit(
      path: string,
      html: string,
      selector: string,
      fields: Record<string, string>,
    ) {
      const $ = load(html);
      const form = $(selector).first();
      assert.ok(form.length, `Missing form ${selector}`);
      const body = new FormData();
      form.find('input[type="hidden"]').each((_, input) => {
        body.append($(input).attr("name")!, $(input).attr("value") ?? "");
      });
      for (const [name, value] of Object.entries(fields)) body.set(name, value);
      return request(path, { method: "POST", body });
    }
    // Every clinical route is closed to an anonymous visitor.
    for (const path of ["/queue", "/intake"]) {
      const response = await request(path);
      assert.equal(response.status, 307, `${path} should redirect when signed out`);
      assert.equal(response.headers.get("location"), "/login");
    }

    const login = await (await request("/login")).text();
    const signedIn = await submit("/login", login, "form", {
      email: aliceEmail,
      password,
    });
    assert.equal(signedIn.status, 303);
    assert.equal(signedIn.headers.get("location"), "/queue");

    // This fresh account has not yet captured the test's own reference.
    // This test's own reference must not already exist. The rest of the queue
    // may legitimately hold records from manual testing, so it is not asserted
    // to be empty.
    const emptyQueue = await (await request("/queue")).text();
    assert.ok(
      !emptyQueue.includes("MRN-HTTP-1"),
      "the test's own patient reference must not already exist",
    );

    // Capture an intake through the real Server Action.
    const intakeHtml = await (await request("/intake")).text();
    const intakeResponse = await submit(
      "/intake",
      intakeHtml,
      'form:has(input[name="presenting_concern"])',
      {
        patient_reference: "MRN-HTTP-1",
        age_years: "58",
        presenting_concern: "Chest pain since this morning",
        patient_account:
          "I woke with a heavy chest pain and I have been sweating since.",
        observed_signs: "Speaking in short sentences.",
      },
    );
    // Saving an intake redirects to the new record rather than re-rendering, so
    // follow it before asserting on the page.
    const encounterPath = intakeResponse.headers.get("location");
    assert.ok(
      encounterPath && encounterPath.startsWith("/encounters/"),
      "submitting an intake redirects to the new record",
    );
    const submitted = await (await request(encounterPath!)).text();
    const submittedText = plainText(submitted);
    assert.ok(
      submittedText.includes("Nothing on this page has been prioritised"),
      "a new intake arrives with no priority attached",
    );
    assert.ok(
      submittedText.includes("Waiting on a clinician decision"),
      "the unapproved state is stated plainly",
    );
    assert.ok(
      submittedText.includes('Patient reported: "chest pain"'),
      "the draft brief was generated from the captured text",
    );
    // The capture is what the patient said, shown verbatim.
    assert.ok(submittedText.includes("I woke with a heavy chest pain"));

    // No priority may be pre-selected in the review form. This is the check
    // that the interface cannot imply a decision the clinician has not made.
    const $submitted = load(submitted);
    const priorityInputs = $submitted('input[name="priority"]');
    assert.equal(priorityInputs.length, 5, "five priority choices are offered");
    priorityInputs.each((_, input) => {
      assert.equal(
        $submitted(input).attr("checked"),
        undefined,
        "no priority may be pre-selected",
      );
    });
    assert.equal(
      $submitted('input[name="next_step"]').length,
      5,
      "five next-step choices are offered",
    );

    const saved = (
      await alice
        .from("encounters")
        .select("id")
        .eq("patient_reference", "MRN-HTTP-1")
        .single()
    ).data!;
    encounterIds.push(saved.id);
    const httpBrief = (
      await alice
        .from("triage_briefs")
        .select("id, status, priority, reviewed_by")
        .eq("encounter_id", saved.id)
        .single()
    ).data!;
    assert.equal(httpBrief.status, "draft");
    assert.equal(httpBrief.priority, null);
    assert.equal(httpBrief.reviewed_by, null);

    // Approving without a decision is refused through the real action.
    const detail = await (await request(`/encounters/${saved.id}`)).text();
    const noDecision = await submit(
      `/encounters/${saved.id}`,
      detail,
      'form:has(input[name="brief_id"])',
      { brief_id: httpBrief.id, intent: "approve" },
    );
    assert.ok(
      (await noDecision.text()).includes("required before approval"),
      "the action refuses an approval with no priority or next step",
    );
    assert.equal(
      (
        await alice
          .from("triage_briefs")
          .select("status")
          .eq("id", httpBrief.id)
          .single()
      ).data!.status,
      "draft",
    );

    // Saving a working draft keeps the brief undecided.
    const saveDraft = await submit(
      `/encounters/${saved.id}`,
      detail,
      'form:has(input[name="brief_id"])',
      {
        brief_id: httpBrief.id,
        intent: "save",
        concern_summary: "Chest pain with sweating since this morning.",
        items_to_check: "- Patient reported: \"chest pain\" — confirmed clinically.",
        open_questions: "- Allergies not yet confirmed.",
        clinician_notes: "Working notes, not a decision.",
      },
    );
    assert.ok(
      (await saveDraft.text()).includes("Draft saved"),
      "a draft saves without attaching a decision",
    );
    const afterSave = (
      await alice.from("triage_briefs").select().eq("id", httpBrief.id).single()
    ).data!;
    assert.equal(afterSave.status, "draft");
    assert.equal(afterSave.priority, null);
    assert.equal(afterSave.reviewed_by, null);
    assert.equal(afterSave.clinician_notes, "Working notes, not a decision.");
    assert.ok(afterSave.items_to_check.includes("confirmed clinically"));

    // A clinician reviews and signs off.
    const approvedResponse = await submit(
      `/encounters/${saved.id}`,
      detail,
      'form:has(input[name="brief_id"])',
      {
        brief_id: httpBrief.id,
        intent: "approve",
        concern_summary: "Chest pain since this morning, with sweating.",
        items_to_check: "- Patient reported: \"chest pain\" — confirmed clinically.",
        open_questions: "- None outstanding.",
        clinician_notes: "Seen by me. Requesting immediate medical review.",
        priority: "immediate",
        next_step: "immediate_escalation",
      },
    );
    const approvedHtml = await approvedResponse.text();
    assert.ok(
      approvedHtml.includes("Clinician-reviewed and approved"),
      "the approved state is shown after sign-off",
    );
    assert.ok(approvedHtml.includes("Escalate immediately"));

    const signedOff = (
      await alice.from("triage_briefs").select().eq("id", httpBrief.id).single()
    ).data!;
    assert.equal(signedOff.status, "approved");
    assert.equal(signedOff.priority, "immediate");
    assert.equal(signedOff.reviewed_by, userIds[0]);
    assert.equal(signedOff.reviewed_by_label, aliceEmail);
    assert.ok(signedOff.approved_at);
    // The patient's own words survived the review untouched.
    assert.ok(signedOff.patient_reported.includes("I woke with a heavy chest pain"));

    // The queue reflects the approval.
    const queueHtml = await (await request("/queue")).text();
    assert.ok(queueHtml.includes("MRN-HTTP-1"));
    assert.ok(
      queueHtml.includes("Immediate"),
      "the approved priority is visible in the shared queue",
    );
    assert.ok(
      !/MRN-HTTP-1[\s\S]{0,600}Not yet decided/.test(queueHtml),
      "the approved record no longer shows as awaiting a decision",
    );

    // The approved view offers no way to change an approved record.
    const $approved = load(approvedHtml);
    assert.equal(
      $approved('form:has(input[name="brief_id"])').length,
      0,
      "an approved record exposes no edit form",
    );
    assert.ok(approvedHtml.includes("This record is now read-only"));

    // Sign out closes the session.
    const signOutResponse = await submit("/queue", queueHtml, "header form", {});
    assert.equal(signOutResponse.status, 303);
    assert.equal(signOutResponse.headers.get("location"), "/login");
    assert.equal((await request("/queue")).headers.get("location"), "/login");

    // A separately provisioned clinician sees the shared queue without
    // inheriting authorship of another clinician's intake.
    const bobLogin = await (
      await request("/login")
    ).text();
    const bobSignedIn = await submit("/login", bobLogin, "form", {
      email: bobEmail,
      password,
    });
    assert.equal(bobSignedIn.status, 303);
    assert.equal(bobSignedIn.headers.get("location"), "/queue");
    const bobQueue = await (await request("/queue")).text();
    assert.ok(
      bobQueue.includes("MRN-HTTP-1"),
      "a separately provisioned account sees the shared department queue",
    );
    assert.ok(
      !bobQueue.includes(`captured by ${bobEmail}`),
      "a separate account has recorded nothing of its own",
    );

    console.log(
      "PASS: password sign-in, the shared department queue, and no inherited authorship",
    );
    console.log(
      "PASS: protected clinical routes, intake capture, draft brief with no priority, refused approval without a decision, clinician sign-off, immutable approved record and sign-out",
    );
  } finally {
    server?.kill("SIGTERM");
    // Records reference accounts with ON DELETE RESTRICT, so clear them first.
    // The test's own patient references are swept as well as the tracked ids, so
    // a run that fails part-way through still leaves the queue clean.
    for (const id of encounterIds)
      await admin.from("encounters").delete().eq("id", id);
    for (const reference of ["MRN-TEST-1", "MRN-HTTP-1"])
      await admin.from("encounters").delete().eq("patient_reference", reference);
    for (const id of userIds) await admin.auth.admin.deleteUser(id);
  }
}
main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Integration test failed",
  );
  process.exitCode = 1;
});
