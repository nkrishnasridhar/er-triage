"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

type CheckInState = "idle" | "connecting" | "listening" | "speaking" | "finished";
type Line = { speaker: "You" | "Christchurch ER"; text: string };
type RealtimeEvent = {
  type: string;
  delta?: string;
  transcript?: string;
  response?: { status?: string };
  error?: { message?: string };
};

export function VoiceCheckIn() {
  const [state, setState] = useState<CheckInState>("idle");
  const [status, setStatus] = useState("Tap to start your check-in.");
  const [lines, setLines] = useState<Line[]>([]);
  const microphone = useRef<MediaStream | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const events = useRef<RTCDataChannel | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const finish = useCallback((message = "Check-in finished.") => {
    microphone.current?.getTracks().forEach((track) => track.stop());
    microphone.current = null;
    events.current?.close();
    events.current = null;
    peer.current?.close();
    peer.current = null;
    audio.current?.pause();
    audio.current = null;
    setState("finished");
    setStatus(message);
  }, []);

  useEffect(() => () => finish(""), [finish]);

  const addLine = useCallback((speaker: Line["speaker"], text?: string) => {
    if (!text?.trim()) return;
    setLines((current) => [...current, { speaker, text }]);
  }, []);

  const start = async () => {
    setState("connecting");
    setStatus("Connecting to the check-in assistant…");
    setLines([]);

    try {
      microphone.current = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      const sessionResponse = await fetch("/api/voice/session", { method: "POST" });
      const sessionText = await sessionResponse.text();
      let session: { error?: string; value?: string } = {};
      try {
        session = sessionText
          ? (JSON.parse(sessionText) as { error?: string; value?: string })
          : {};
      } catch {
        throw new Error("The voice service returned an unexpected response.");
      }
      if (!sessionResponse.ok || !session.value) {
        throw new Error(session.error ?? "Unable to start the voice check-in.");
      }

      const connection = new RTCPeerConnection();
      peer.current = connection;
      microphone.current.getTracks().forEach((track) => {
        connection.addTrack(track, microphone.current!);
      });

      const speaker = new Audio();
      speaker.autoplay = true;
      speaker.onplaying = () => {
        setState("speaking");
        setStatus("Christchurch ER is speaking…");
      };
      connection.ontrack = ({ streams }) => {
        speaker.srcObject = streams[0];
        void speaker.play().catch(() => undefined);
      };
      audio.current = speaker;

      const channel = connection.createDataChannel("oai-events");
      events.current = channel;
      channel.onopen = () => {
        channel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              input: [],
              instructions:
                "Start the check-in now with a short, warm welcome and the first question.",
            },
          }),
        );
      };
      channel.onmessage = ({ data }) => {
        const event = JSON.parse(data) as RealtimeEvent;

        if (event.type === "input_audio_buffer.speech_started") {
          setState("listening");
          setStatus("Listening…");
        } else if (event.type === "input_audio_buffer.speech_stopped") {
          setStatus("Thinking…");
        } else if (
          event.type === "conversation.item.input_audio_transcription.completed"
        ) {
          addLine("You", event.transcript);
        } else if (event.type === "response.output_audio_transcript.done") {
          addLine("Christchurch ER", event.transcript);
        } else if (event.type === "response.done") {
          if (event.response?.status === "completed") {
            setState("listening");
            setStatus("Listening…");
          }
        } else if (event.type === "error") {
          finish(event.error?.message ?? "The voice check-in could not continue.");
        }
      };

      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      const answerResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.value}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });
      if (!answerResponse.ok) {
        throw new Error("Unable to connect the voice check-in.");
      }

      await connection.setRemoteDescription({
        type: "answer",
        sdp: await answerResponse.text(),
      });
      setState("listening");
      setStatus("Listening…");
    } catch (error) {
      finish(error instanceof Error ? error.message : "Unable to start the voice check-in.");
    }
  };

  const active = state === "connecting" || state === "listening" || state === "speaking";

  return (
    <div className="mt-12 flex w-full max-w-xl flex-col items-center">
      <button
        type="button"
        onClick={start}
        disabled={active}
        className="flex min-h-52 min-w-52 flex-col items-center justify-center gap-3 rounded-full bg-blue p-8 transition-transform active:scale-95 disabled:cursor-wait disabled:active:scale-100"
      >
        <Mic aria-hidden="true" className="size-14" strokeWidth={1.75} />
        <span className="text-lg font-semibold">
          {state === "idle" || state === "finished" ? "Tap to begin" : "Check-in started"}
        </span>
      </button>

      <p className="mt-5 text-sm text-charcoal" role="status" aria-live="polite">
        {status}
      </p>

      {active && (
        <button
          type="button"
          onClick={() => finish()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold"
        >
          <Square aria-hidden="true" className="size-4 fill-current" />
          Finish check-in
        </button>
      )}

      {lines.length > 0 && (
        <section
          className="mt-10 w-full rounded-[20px] bg-white p-5 text-left sm:p-6"
          aria-label="Check-in conversation"
          aria-live="polite"
        >
          <h2 className="text-sm font-semibold">Conversation</h2>
          <ol className="mt-4 space-y-4">
            {lines.map((line, index) => (
              <li key={`${line.speaker}-${index}`} className="text-sm leading-6">
                <span className="font-semibold">{line.speaker}: </span>
                {line.text}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
