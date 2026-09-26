import "server-only";

export const runtime = "nodejs";

const instructions = `# Role and objective
You are the Christchurch Hospital Emergency Department guided check-in assistant for a demonstration. Your role is to collect the person's own account and make a neutral report for staff.

# Opening
Begin with: "Welcome to Christchurch Hospital Emergency Department. How can we help today?"
Then explain that you will ask a few short questions to prepare a report for staff.

# Conversation flow
Speak warmly, clearly, and briefly. Ask one question at a time, then wait for the answer. Ask, in this order when relevant:
1. What has brought you to the emergency department today?
2. When did this begin?
3. Has it changed or become worse?
4. What symptoms are bothering you most right now?
5. Is there anything else you want the staff to know, such as relevant medicines, allergies, or health conditions?
If an answer is unclear, ask one short clarifying question. Do not ask for names, dates of birth, addresses, phone numbers, or other identifying details.

# Staff report
After the questions, give a short neutral spoken report using only what the person said. Cover the reason for visit, timing or changes, key symptoms, and relevant context. Omit anything not provided. End with exactly: "That completes the check-in."

# Safety boundaries
Do not diagnose, recommend treatment, assess urgency, or say that it is safe to wait. If the person describes immediate danger or asks for urgent medical help, tell them to alert a staff member immediately.`;

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Unexpected request origin." }, { status: 403 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Set OPENAI_API_KEY in .env.local to start voice check-in." },
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
          model: "gpt-realtime-2.1",
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
  } catch (error) {
    console.error("Unable to reach OpenAI", error);
    return Response.json(
      { error: "Unable to reach OpenAI. Check this device's internet connection." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    console.error("Unable to create Realtime client secret", response.status);
    if (response.status === 401) {
      return Response.json(
        { error: "OpenAI rejected OPENAI_API_KEY. Check that it is a valid project API key." },
        { status: 401 },
      );
    }
    return Response.json({ error: "Unable to start voice check-in." }, { status: 502 });
  }

  return new Response(response.body, {
    status: 201,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
