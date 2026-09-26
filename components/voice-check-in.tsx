"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { VOICE_ACCOUNT_STORAGE_KEY } from "@/lib/voice-check-in";

type CheckInState = "idle" | "connecting" | "listening" | "speaking" | "finished";
type RealtimeEvent = {
  type: string;
  transcript?: string;
  response?: { status?: string };
};

const voiceFailure = "Voice check-in could not continue. You can use the written check-in instead.";
const fixedQuestions = [
  "What is your name, how old are you, and what is your sex?",
  "What would you like staff to know about why you came in today?",
  "When did this start?",
  "Has it changed since it started?",
  "What symptoms are you experiencing right now?",
  "Is there anything else you’d like staff to know, including medicines, allergies, or health conditions?",
];

function normalizeTranscript(text: string) {
  return text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function VoiceCheckIn() {
  const router = useRouter();
  const [state, setState] = useState<CheckInState>("idle");
  const [status, setStatus] = useState("Tap to begin your check-in.");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const patientAnswers = useRef<string[]>([]);
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

  const start = async () => {
    setState("connecting");
    setStatus("Connecting to the check-in assistant…");
    setCurrentQuestion("");
    patientAnswers.current = [];

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
        setStatus("ERgency is speaking…");
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
                "Begin by asking question 1 exactly as written in your instructions. Do not add a welcome or preamble. Ask all six fixed questions in order regardless of the answers. Do not skip, rephrase, or add questions.",
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
          if (event.transcript?.trim()) patientAnswers.current.push(event.transcript.trim());
        } else if (event.type === "response.output_audio_transcript.done") {
          if (event.transcript) {
            const spoken = normalizeTranscript(event.transcript);
            const question = fixedQuestions.find(
              (candidate) => normalizeTranscript(candidate) === spoken,
            );
            if (question) setCurrentQuestion(question);
          }
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
    const account = patientAnswers.current.join("\n").trim();
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

      {currentQuestion && (
        <section
          className="mt-5 flex h-[22dvh] min-h-36 w-full flex-col rounded-card bg-surface p-5 text-left shadow-sm sm:p-6"
          aria-label="Current check-in question"
          aria-live="polite"
        >
          <h2 className="text-sm font-semibold">Current question</h2>
          <p className="mt-4 min-h-0 flex-1 overflow-y-auto text-base leading-7">
            {currentQuestion}
          </p>
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
