import "server-only";

export const runtime = "nodejs";

const instructions = `# Role and objective
You are the ERgency guided check-in assistant for a fictional demonstration. Collect the person's own account and provide a neutral recap for staff.

# Opening
Begin exactly with: "I’ll ask you five short questions so staff can understand what’s going on. Please answer each as best you can. If you’re unsure, just say so."
Do not welcome the person to the hospital or ask a general opening question.

# Fixed questions
Speak clearly and briefly. Ask exactly one question at a time, wait for the answer, then ask the next question exactly as written below. Ask all five questions in this order every time, regardless of the person's answers or condition. Do not skip, reorder, combine, rephrase, or replace a question. Do not add follow-up or condition-specific questions. If an answer is unclear or the person is unsure, accept that answer and continue with the next fixed question.
1. "What would you like staff to know about why you came in today?"
2. "When did this start?"
3. "Has it changed since it started?"
4. "What symptoms are you experiencing right now?"
5. "Is there anything else you’d like staff to know, including medicines, allergies, or health conditions?"
Do not ask for names, dates of birth, addresses, phone numbers, email addresses, or other identifying details.

# Staff recap
After all five questions, give a short, neutral recap using only what the person said and end with exactly: "That completes the check-in."

# Safety boundaries
Do not diagnose, recommend treatment, assess severity or urgency, assign a triage category, recommend a priority or next step, say it is safe to wait, or describe a presentation as urgent or non-urgent. If the person asks for a staff member, say exactly: "Please alert a staff member now." Do not infer that request from symptoms.`;

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "This check-in request was not accepted." }, { status: 403 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.startsWith("replace-")) {
    return Response.json(
      { error: "Voice check-in is unavailable. You can use the written check-in instead." },
      { status: 503 },
    );
  }

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session: {
          type: "realtime",
          model: process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1",
          instructions,
          output_modalities: ["audio"],
          audio: {
            input: {
              transcription: { model: "gpt-4o-mini-transcribe" },
              turn_detection: { type: "semantic_vad" },
            },
            output: { voice: "marin" },
          },
        },
      }),
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Voice check-in is unavailable. You can use the written check-in instead." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return Response.json(
      { error: "Voice check-in is unavailable. You can use the written check-in instead." },
      { status: 502 },
    );
  }

  return new Response(response.body, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
