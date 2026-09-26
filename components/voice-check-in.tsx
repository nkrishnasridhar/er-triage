"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { VOICE_ACCOUNT_STORAGE_KEY } from "@/lib/voice-check-in";

type CheckInState = "idle" | "connecting" | "listening" | "speaking" | "finished";
type Line = { speaker: "You" | "Front Brief"; text: string };
type RealtimeEvent = {
  type: string;
  transcript?: string;
  response?: { status?: string };
};

const voiceFailure = "Voice check-in could not continue. You can use the written check-in instead.";

export function VoiceCheckIn() {
  const router = useRouter();
  const [state, setState] = useState<CheckInState>("idle");
  const [status, setStatus] = useState("Tap to begin your check-in.");
  const [lines, setLines] = useState<Line[]>([]);
  const microphone = useRef<MediaStream | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const events = useRef<RTCDataChannel | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const closeConnection = useCallback(() => {
    microphone.current?.getTracks().forEach((track) => track.stop());
    microphone.current = null;
    events.current?.close();
    events.current = null;
    peer.current?.close();
    peer.current = null;
    audio.current?.pause();
    audio.current = null;
  }, []);

  const finish = useCallback(
    (message = "Check-in finished.") => {
      closeConnection();
      setState("finished");
      setStatus(message);
    },
    [closeConnection],
  );

  useEffect(() => () => closeConnection(), [closeConnection]);

  const addLine = useCallback((speaker: Line["speaker"], text?: string) => {
    if (!text?.trim()) return;
    setLines((current) => [...current, { speaker, text: text.trim() }]);
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
      const session = (await sessionResponse.json().catch(() => null)) as
        | { error?: string; value?: string }
        | null;
      if (!sessionResponse.ok || !session?.value) {
        throw new Error(session?.error ?? voiceFailure);
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
        setStatus("Front Brief is speaking…");
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
                "Start with the exact opening statement in your instructions, then ask question 1 verbatim. Ask all five fixed questions in order regardless of the answers. Do not skip, rephrase, or add questions.",
            },
          }),
        );
      };
      channel.onmessage = ({ data }) => {
        let event: RealtimeEvent;
        try {
          event = JSON.parse(data) as RealtimeEvent;
        } catch {
          return;
        }

        if (event.type === "input_audio_buffer.speech_started") {
          setState("listening");
          setStatus("Listening…");
        } else if (event.type === "input_audio_buffer.speech_stopped") {
          setStatus("Thinking…");
        } else if (event.type === "conversation.item.input_audio_transcription.completed") {
          addLine("You", event.transcript);
        } else if (event.type === "response.output_audio_transcript.done") {
          addLine("Front Brief", event.transcript);
        } else if (event.type === "response.done" && event.response?.status === "completed") {
          setState("listening");
          setStatus("Listening…");
        } else if (event.type === "error") {
          finish(voiceFailure);
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
      if (!answerResponse.ok) throw new Error(voiceFailure);

      await connection.setRemoteDescription({
        type: "answer",
        sdp: await answerResponse.text(),
      });
      setState("listening");
      setStatus("Listening…");
    } catch {
      finish(voiceFailure);
    }
  };

  const continueToConfirmation = () => {
    const account = lines
      .filter((line) => line.speaker === "You")
      .map((line) => line.text)
      .join("\n")
      .trim();
    if (!account) {
      setStatus("Say something first, or use the written check-in instead.");
      return;
    }
    window.sessionStorage.setItem(VOICE_ACCOUNT_STORAGE_KEY, account);
    closeConnection();
    router.push("/check-in");
  };

  const active = state === "connecting" || state === "listening" || state === "speaking";

  return (
    <div className="mx-auto mt-6 flex min-h-0 w-full max-w-xl flex-col items-center">
      <button
        type="button"
        onClick={start}
        disabled={active}
        className="flex size-48 shrink-0 flex-col items-center justify-center gap-3 rounded-full bg-moss p-8 text-pine shadow-sm transition-transform active:scale-95 disabled:cursor-wait disabled:active:scale-100 sm:size-52"
      >
        <Mic aria-hidden="true" className="size-14" strokeWidth={1.75} />
        <span className="text-lg font-semibold">
          {state === "idle" || state === "finished" ? "Tap to begin" : "Check-in started"}
        </span>
      </button>

      <p className="mt-4 text-sm text-muted" role="status" aria-live="polite">
        {status}
      </p>

      {active && (
        <button
          type="button"
          onClick={() => finish()}
          className="mt-3 inline-flex items-center gap-2 rounded-control border border-line bg-surface px-5 py-3 text-sm font-semibold"
        >
          <Square aria-hidden="true" className="size-4 fill-current" />
          Finish check-in
        </button>
      )}

      {lines.length > 0 && (
        <section
          className="mt-5 flex h-[22dvh] min-h-36 w-full flex-col rounded-card bg-surface p-5 text-left shadow-sm sm:p-6"
          aria-label="Check-in conversation"
          aria-live="polite"
        >
          <h2 className="text-sm font-semibold">Conversation</h2>
          <ol className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {lines.map((line, index) => (
              <li key={`${line.speaker}-${index}`} className="text-sm leading-6">
                <span className="font-semibold">{line.speaker}: </span>
                {line.text}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={continueToConfirmation}
            className="mt-4 inline-flex min-h-12 shrink-0 w-full items-center justify-center rounded-control bg-moss px-5 text-sm font-semibold text-pine"
          >
            Review text and continue
          </button>
        </section>
      )}
    </div>
  );
}
