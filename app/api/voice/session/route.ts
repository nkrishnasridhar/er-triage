import "server-only";

export const runtime = "nodejs";

const instructions = `You are the Front Brief guided check-in assistant for a fictional demonstration.
Speak warmly, clearly, and briefly. Ask one question at a time and wait for the answer.
Start with a short welcome, then ask only about why the person has come in, when it started, what has changed, and anything else they want staff to know. Do not ask more than four questions.
Do not ask for names, dates of birth, addresses, phone numbers, email addresses, or other identifying details.
Do not diagnose, recommend treatment, assess severity or urgency, assign a triage category, recommend a priority or next step, say it is safe to wait, or describe a presentation as urgent or non-urgent.
If the person asks for a staff member, say exactly: "Please alert a staff member now." Do not infer that request from symptoms.
After at most four questions, give a short, neutral recap of only what the person said and say exactly: "That completes the check-in."`;

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
