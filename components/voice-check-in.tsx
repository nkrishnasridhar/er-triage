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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [patientAnswers, setPatientAnswers] = useState<string[]>([]);
  const [pendingAnswer, setPendingAnswer] = useState("");
  const nextQuestionIndex = useRef(0);
  const initialQuestionSent = useRef(false);
  const pendingAnswerRef = useRef("");
  const askQuestionRef = useRef<((index: number) => void) | null>(null);
  const microphone = useRef<MediaStream | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const events = useRef<RTCDataChannel | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const closeConnection = useCallback(() => {
    microphone.current?.getTracks().forEach((track) => track.stop());
    microphone.current = null;
    events.current?.close();
    events.current = null;
    askQuestionRef.current = null;
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
    nextQuestionIndex.current = 0;
    initialQuestionSent.current = false;
    setCurrentQuestion(fixedQuestions[0]);
    setQuestionIndex(0);
    setPatientAnswers([]);
    setPendingAnswer("");
    pendingAnswerRef.current = "";

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
      const askQuestion = (index: number) => {
        const question = fixedQuestions[index];
        if (!question) return;
        nextQuestionIndex.current = index;
        setQuestionIndex(index);
        setCurrentQuestion(question);
        channel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              input: [],
              instructions: `Say exactly this one question and nothing else: "${question}"`,
            },
          }),
        );
      };
      askQuestionRef.current = askQuestion;
      channel.onopen = () => {
        channel.send(
          JSON.stringify({
            type: "session.update",
            session: {
              type: "realtime",
              audio: {
                input: {
                  turn_detection: {
                    type: "semantic_vad",
                    create_response: false,
                    interrupt_response: false,
                  },
                },
              },
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

        if (event.type === "session.updated" && !initialQuestionSent.current) {
          initialQuestionSent.current = true;
          askQuestion(0);
        } else if (event.type === "input_audio_buffer.speech_started") {
          setState("listening");
          setStatus("Listening…");
        } else if (event.type === "input_audio_buffer.speech_stopped") {
          setStatus("Thinking…");
        } else if (event.type === "conversation.item.input_audio_transcription.completed") {
          const answer = event.transcript?.trim();
          if (answer && !pendingAnswerRef.current) {
            pendingAnswerRef.current = answer;
            setPendingAnswer(answer);
            microphone.current?.getAudioTracks().forEach((track) => {
              track.enabled = false;
            });
            setStatus("Answer detected.");
          }
        } else if (event.type === "response.output_audio_transcript.done") {
          if (event.transcript) {
            const spoken = normalizeTranscript(event.transcript);
            const question = fixedQuestions.find(
              (candidate) => spoken.includes(normalizeTranscript(candidate)),
            );
            if (question) setCurrentQuestion(question);
          }
        } else if (event.type === "response.done" && event.response?.status === "completed") {
          if (!pendingAnswerRef.current) {
            setState("listening");
            setStatus("Listening for your answer…");
          }
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

  const continueToConfirmation = (answers = patientAnswers) => {
    const account = answers.join("\n").trim();
    if (!account) {
      setStatus("Say something first, or use the written check-in instead.");
      return;
    }
    window.sessionStorage.setItem(VOICE_ACCOUNT_STORAGE_KEY, account);
    closeConnection();
    router.push("/check-in");
  };

  const retryAnswer = () => {
    pendingAnswerRef.current = "";
    setPendingAnswer("");
    microphone.current?.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
    setState("listening");
    setStatus("Listening for your answer…");
  };

  const acceptAnswer = () => {
    const answer = pendingAnswerRef.current;
    if (!answer) return;
    const acceptedAnswers = [...patientAnswers, answer];
    setPatientAnswers(acceptedAnswers);
    pendingAnswerRef.current = "";
    setPendingAnswer("");

    const nextIndex = nextQuestionIndex.current + 1;
    if (nextIndex < fixedQuestions.length) {
      microphone.current?.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      askQuestionRef.current?.(nextIndex);
    } else {
      continueToConfirmation(acceptedAnswers);
    }
  };

  const handleMainButton = () => {
    if (pendingAnswer) {
      acceptAnswer();
    } else if (state === "finished") {
      if (patientAnswers.length > 0) continueToConfirmation();
      else void start();
    } else if (state === "idle") {
      void start();
    }
  };

  const mainButtonLabel = pendingAnswer
    ? questionIndex === fixedQuestions.length - 1
      ? "Review answers"
      : "Next question"
    : state === "finished"
      ? patientAnswers.length > 0
        ? "Review answers"
        : "Tap to begin"
      : state === "idle"
        ? "Tap to begin"
        : "Check-in started";

  const active = state === "connecting" || state === "listening" || state === "speaking";

  return (
    <div className="mx-auto mt-6 flex min-h-0 w-full max-w-xl flex-col items-center">
      {currentQuestion && (
        <section
          className="mb-5 w-full rounded-card bg-surface p-5 text-left shadow-sm sm:p-6"
          aria-label="Current check-in question"
          aria-live="polite"
        >
          <h2 className="text-sm font-semibold">Question {questionIndex + 1} of 6</h2>
          <p className="mt-2 text-base leading-7">{currentQuestion}</p>
          {pendingAnswer && (
            <div className="mt-4">
              <button
                type="button"
                onClick={retryAnswer}
                className="min-h-12 rounded-control border border-line bg-surface px-5 text-sm font-semibold"
              >
                Try again
              </button>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={handleMainButton}
        disabled={active && !pendingAnswer}
        className="flex size-48 shrink-0 flex-col items-center justify-center gap-3 rounded-full bg-moss p-8 text-pine shadow-sm transition-transform active:scale-95 disabled:cursor-wait disabled:active:scale-100 sm:size-52"
      >
        <Mic aria-hidden="true" className="size-14" strokeWidth={1.75} />
        <span className="text-lg font-semibold">{mainButtonLabel}</span>
      </button>

      <p className="mt-4 text-sm text-muted" role="status" aria-live="polite">
        {status}
      </p>

      {active && (
        <button
          type="button"
          onClick={() => {
            pendingAnswerRef.current = "";
            setPendingAnswer("");
            finish("Check-in stopped.");
          }}
          className="mt-3 inline-flex items-center gap-2 rounded-control border border-line bg-surface px-5 py-3 text-sm font-semibold"
        >
          <Square aria-hidden="true" className="size-4 fill-current" />
          Stop check-in
        </button>
      )}

    </div>
  );
}
