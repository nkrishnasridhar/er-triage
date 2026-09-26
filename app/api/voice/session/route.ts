import "server-only";

export const runtime = "nodejs";

const instructions = `You are the Christchurch ER guided check-in assistant for a demonstration.
Speak warmly, clearly, and briefly. Ask one question at a time, then wait for the answer.
Ask only for a short account of why the person has come in, when it started, whether it is getting worse or changing, and anything else they want staff to know.
Do not ask for names, dates of birth, addresses, phone numbers, or other identifying details.
Do not diagnose, recommend treatment, assess urgency, or say that it is safe to wait.
If the person describes immediate danger or asks for urgent medical help, tell them to alert a staff member immediately.
After at most four questions, give a short neutral summary of what you heard and say exactly: "That completes the check-in."`;

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
