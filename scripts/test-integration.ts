/** Local-only RLS and HTTP smoke test. Never accepts a remote Supabase project. */
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { createClient } from "@supabase/supabase-js";
import { load } from "cheerio";

const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const pnpmShell = process.platform === "win32";

async function main() {
  const local = JSON.parse(
    execFileSync(pnpmCommand, ["supabase", "status", "-o", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      shell: pnpmShell,
    }),
  );
  assert.equal(new URL(local.API_URL).hostname, "127.0.0.1", "Only local Supabase is allowed");
  assert.equal(new URL(local.API_URL).port, "55431", "Use the isolated local test stack");

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
  const nurse = publicClient();
  const anonymous = publicClient();
  const userIds: string[] = [];
  const encounterIds: string[] = [];
  const run = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const password = `local-only-${run}-Password1!`;
  const emails = {
    alice: `alice-${run}@example.test`,
    bob: `bob-${run}@example.test`,
    nurse: `nurse-${run}@example.test`,
  };
  let server: ReturnType<typeof spawn> | undefined;

  try {
    for (const [client, email] of [
      [alice, emails.alice],
      [bob, emails.bob],
      [nurse, emails.nurse],
    ] as const) {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      assert.equal(error, null);
      userIds.push(data.user!.id);
      assert.equal((await client.auth.signInWithPassword({ email, password })).error, null);
    }
    for (const userId of userIds.slice(0, 2)) {
      assert.equal(
        (await admin.from("staff_profiles").update({ role: "clinician" }).eq("user_id", userId)).error,
        null,
      );
    }

    // The anonymous tablet can use only the narrow, atomic capture RPC.
    assert.ok((await anonymous.from("encounters").select()).error, "Anonymous reads are denied");
    assert.ok(
      (await anonymous.from("encounters").insert({ patient_reference: "FORGED", presenting_concern: "Forged" })).error,
      "Anonymous direct inserts are denied",
    );
    const { data: capturedId, error: captureError } = await anonymous.rpc("capture_tablet_intake", {
      patient_reference_input: "TABLET-RLS-1",
      presenting_concern_input: "Ankle pain",
      patient_account_input: "I twisted my ankle on the step.",
      speech_used_input: true,
      concern_summary_input: "Ankle pain after a twist.",
      items_to_check_input: '- Patient reported: "twisted my ankle" — recorded in the account.',
      open_questions_input: "When did this happen?",
      drafted_from_input: "deterministic-fallback-v1",
    });
    assert.equal(captureError, null);
    assert.ok(capturedId);
    encounterIds.push(capturedId!);

    const encounter = (
      await admin.from("encounters").select("*").eq("id", capturedId!).single()
    ).data!;
    assert.equal(encounter.submission_source, "tablet");
    assert.equal(encounter.speech_used, true);
    assert.equal(encounter.recorded_by, null);
    const brief = (
      await admin.from("triage_briefs").select("*").eq("encounter_id", capturedId!).single()
    ).data!;
    assert.equal(brief.drafted_by, null);
    assert.equal(brief.drafted_from, "deterministic-fallback-v1");
    assert.equal(brief.patient_reported, encounter.patient_account);

    assert.ok(
      (await anonymous.from("encounters").update({ presenting_concern: "Rewritten" }).eq("id", capturedId!)).error,
      "Anonymous updates are denied",
    );

    // Both clinicians and read-only staff can see the hand-off, but only a
    // clinician can alter the draft or record a named decision.
    assert.equal((await alice.from("encounters").select("id").eq("id", capturedId!)).data?.length, 1);
    assert.equal((await bob.from("encounters").select("id").eq("id", capturedId!)).data?.length, 1);
    assert.equal((await nurse.from("encounters").select("id").eq("id", capturedId!)).data?.length, 1);
    const nurseUpdate = await nurse
      .from("triage_briefs")
      .update({ clinician_notes: "Not permitted" })
      .eq("id", brief.id)
      .select();
    assert.ok(nurseUpdate.error || nurseUpdate.data?.length === 0, "A nurse role is read-only");
    assert.equal(
      (await admin.from("triage_briefs").select("clinician_notes").eq("id", brief.id).single()).data!
        .clinician_notes,
      "",
    );

    assert.ok(
      (
        await alice.from("triage_briefs").update({ status: "approved" }).eq("id", brief.id)
      ).error,
      "Approval without a clinician decision is refused",
    );
    const approvedAt = new Date().toISOString();
    assert.equal(
      (
        await bob
          .from("triage_briefs")
          .update({
            clinician_notes: "Clinician review complete.",
            priority: "urgent",
            next_step: "priority_clinical_review",
            status: "approved",
            reviewed_by: userIds[1],
            reviewed_by_label: emails.bob,
            approved_at: approvedAt,
          })
          .eq("id", brief.id)
      ).error,
      null,
    );
    const frozen = (
      await admin.from("triage_briefs").select("*").eq("id", brief.id).single()
    ).data!;
    await alice.from("triage_briefs").update({ clinician_notes: "Quietly changed" }).eq("id", brief.id);
    assert.deepEqual(
      (await admin.from("triage_briefs").select("*").eq("id", brief.id).single()).data,
      frozen,
      "An approved brief is immutable for every clinician",
    );

    // Exercise the actual tablet Server Action and authenticated review route.
    const env = {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: local.API_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key,
    };
    execFileSync(pnpmCommand, ["build"], { env, stdio: "pipe", shell: pnpmShell });
    const probe = createServer();
    probe.listen(0, "127.0.0.1");
    await once(probe, "listening");
    const address = probe.address();
    assert.ok(address && typeof address === "object");
    await new Promise<void>((resolve) => probe.close(() => resolve()));
    server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(address.port)],
      { env, stdio: "ignore" },
    );
    const origin = `http://127.0.0.1:${address.port}`;
    for (let attempt = 0; attempt < 100; attempt += 1) {
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
          Cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
          Origin: origin,
          ...init.headers,
        },
      });
      for (const cookie of response.headers.getSetCookie()) {
        const [part] = cookie.split(";");
        const index = part.indexOf("=");
        cookies.set(part.slice(0, index), part.slice(index + 1));
      }
      return response;
    }
    async function submit(path: string, html: string, selector: string, fields: Record<string, string>) {
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

    const tabletHtml = await (await request("/")).text();
    assert.ok(tabletHtml.includes("Tell us what is happening"));
    assert.ok(!tabletHtml.includes("priority"), "The tablet never exposes a priority control");
    const tabletResult = await submit("/", tabletHtml, 'form:has(textarea[name="patient_account"])', {
      patient_reference: "TABLET-HTTP-1",
      presenting_concern: "Sore ankle",
      patient_account: "I rolled my ankle while walking.",
      speech_used: "false",
    });
    assert.ok((await tabletResult.text()).includes("account has been sent"));

    assert.equal((await request("/queue")).status, 307, "The queue is never public");
    const login = await (await request("/login")).text();
    const signedIn = await submit("/login", login, "form", { email: emails.alice, password });
    assert.equal(signedIn.headers.get("location"), "/queue");
    const queue = await (await request("/queue")).text();
    assert.ok(queue.includes("TABLET-HTTP-1"));
    assert.ok(queue.includes("Awaiting review"));
    assert.ok(!queue.includes("AI priority"));

    console.log("PASS: anonymous tablet hand-off, role-gated review, immutable approval, and clinician queue");
  } finally {
    server?.kill("SIGTERM");
    for (const id of encounterIds) await admin.from("encounters").delete().eq("id", id);
    for (const reference of ["TABLET-RLS-1", "TABLET-HTTP-1"])
      await admin.from("encounters").delete().eq("patient_reference", reference);
    for (const userId of userIds) await admin.from("staff_role_audit").delete().eq("user_id", userId);
    for (const userId of userIds) await admin.from("staff_profiles").delete().eq("user_id", userId);
    for (const userId of userIds) await admin.auth.admin.deleteUser(userId);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Integration test failed");
  process.exitCode = 1;
});
