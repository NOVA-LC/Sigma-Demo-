"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import ChatMessage from "@/components/triage/ChatMessage";
import TypingIndicator from "@/components/triage/TypingIndicator";
import LogTerminal, { type LogLine } from "@/components/triage/LogTerminal";

type ChatEntry =
  | { id: string; kind: "message"; author: "Jessica" | "Sigma AI"; time: string; body: React.ReactNode }
  | { id: string; kind: "typing" };

const logs: LogLine[] = [
  {
    id: "l1",
    timestamp: "2024-05-20 03:14:02",
    level: "INFO",
    service: "auth-svc",
    message: "User 8b22-f9a1-c402-9e31  Auth Request received (POST /v1/scan/verify)",
  },
  {
    id: "l2",
    timestamp: "2024-05-20 03:14:02",
    level: "INFO",
    service: "auth-svc",
    message: "User 8b22-f9a1-c402-9e31  Token validated  status=ACTIVE  plan=PAID",
  },
  {
    id: "l3",
    timestamp: "2024-05-20 03:14:03",
    level: "INFO",
    service: "gateway-04",
    message: "GET /scanner/session/7d13-4ac0 → 200 OK (12ms)",
  },
  {
    id: "l4",
    timestamp: "2024-05-20 03:14:04",
    level: "WARN",
    service: "gateway-04",
    message: "Latency spike: p99=4821ms (threshold 800ms)",
  },
  {
    id: "l5",
    timestamp: "2024-05-20 03:14:05",
    level: "ERROR",
    service: "gateway-04",
    message: "ConnectionTimeout at Gateway-04 (IP: 10.0.4.1) retry=3/3",
    isRootCause: true,
  },
  {
    id: "l6",
    timestamp: "2024-05-20 03:14:05",
    level: "ERROR",
    service: "gateway-04",
    message: "upstream scanner-api:9443 unreachable",
  },
  {
    id: "l7",
    timestamp: "2024-05-20 03:14:06",
    level: "WARN",
    service: "router",
    message: "42 concurrent timeouts detected on scanner-gateway-04",
  },
];

// Timeline (ms from mount)
const T = {
  jessica: 600,
  aiTypingStart: 1800,
  aiAck: 2600,
  terminalOpen: 3400,
  firstLog: 3800,
  logGap: 380,
  highlight: 0, // computed below
  aiDiagnosisTyping: 0,
  aiDiagnosis: 0,
  buildCta: 0,
};
T.highlight = T.firstLog + logs.length * T.logGap + 200;
T.aiDiagnosisTyping = T.highlight + 700;
T.aiDiagnosis = T.aiDiagnosisTyping + 1000;
T.buildCta = T.aiDiagnosis + 900;

export default function TriageDashboardPage() {
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [highlightError, setHighlightError] = useState(false);
  const [showCta, setShowCta] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pushTimeout = (fn: () => void, delay: number) => {
    timeoutsRef.current.push(setTimeout(fn, delay));
  };

  useEffect(() => {
    // STEP 1: Jessica
    pushTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          id: "m-jessica",
          kind: "message",
          author: "Jessica",
          time: "03:14",
          body: (
            <>
              <span className="font-semibold text-red-300">John&apos;s card isn&apos;t working again.</span>{" "}
              Help!
            </>
          ),
        },
      ]);
    }, T.jessica);

    // STEP 2: Sigma AI typing → ack
    pushTimeout(() => {
      setChat((prev) => [...prev, { id: "typing-1", kind: "typing" }]);
    }, T.aiTypingStart);

    pushTimeout(() => {
      setChat((prev) =>
        prev
          .filter((e) => e.id !== "typing-1")
          .concat({
            id: "m-ack",
            kind: "message",
            author: "Sigma AI",
            time: "03:14",
            body: "I'm on it. Checking logs...",
          }),
      );
    }, T.aiAck);

    // STEP 3: Terminal + streaming logs
    pushTimeout(() => setTerminalOpen(true), T.terminalOpen);
    logs.forEach((_, idx) => {
      pushTimeout(() => setVisibleLogs(idx + 1), T.firstLog + idx * T.logGap);
    });

    // STEP 4: Highlight ERROR
    pushTimeout(() => setHighlightError(true), T.highlight);

    // STEP 5: AI diagnosis
    pushTimeout(() => {
      setChat((prev) => [...prev, { id: "typing-2", kind: "typing" }]);
    }, T.aiDiagnosisTyping);

    pushTimeout(() => {
      setChat((prev) =>
        prev
          .filter((e) => e.id !== "typing-2")
          .concat({
            id: "m-diagnosis",
            kind: "message",
            author: "Sigma AI",
            time: "03:14",
            body: (
              <>
                <span className="font-semibold">Identified the issue:</span>{" "}
                The Scanner Gateway is down, not the user account. I don&apos;t
                have a playbook for this yet.{" "}
                <span className="font-semibold">
                  Should I build one with you?
                </span>
              </>
            ),
          }),
      );
    }, T.aiDiagnosis);

    // FINAL: CTA
    pushTimeout(() => setShowCta(true), T.buildCta);

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-primary-navy text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,153,255,0.12),_transparent_60%)]" />

      <div className="relative px-10 py-8">
        <header className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-heading font-semibold tracking-[0.2em] text-light-gray/70 uppercase mb-1.5">
              Triage
            </p>
            <h1 className="font-heading font-semibold text-3xl text-white">
              AI Triage Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-light-gray/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Autonomous mode engaged
          </div>
        </header>

        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* Live Chat */}
          <section className="col-span-12 lg:col-span-5 rounded-xl border border-white/10 bg-secondary-dark/70 backdrop-blur shadow-lg flex flex-col h-[560px]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-heading font-semibold text-[11px] tracking-[0.16em] text-light-gray uppercase">
                Live Chat · YMCA North Branch
              </span>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {chat.length === 0 ? (
                <div className="text-xs text-light-gray/40 italic">
                  Listening for signals...
                </div>
              ) : (
                chat.map((entry) =>
                  entry.kind === "typing" ? (
                    <TypingIndicator key={entry.id} />
                  ) : (
                    <ChatMessage
                      key={entry.id}
                      author={entry.author}
                      time={entry.time}
                    >
                      {entry.body}
                    </ChatMessage>
                  ),
                )
              )}
            </div>
          </section>

          {/* Terminal */}
          <section className="col-span-12 lg:col-span-7 h-[560px]">
            {terminalOpen ? (
              <div className="h-full animate-slide-in-right">
                <LogTerminal
                  logs={logs}
                  visibleCount={visibleLogs}
                  highlightError={highlightError}
                />
              </div>
            ) : (
              <div className="h-full rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-light-gray/30 font-mono">
                Waiting for the agent to attach logs…
              </div>
            )}
          </section>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          {showCta && (
            <Link
              href="/builder"
              className="animate-line-in inline-flex items-center gap-2 rounded-full bg-accent-blue hover:bg-[#33ADFF] transition-colors shadow-[0_0_30px_rgba(0,153,255,0.4)] px-8 py-4 font-heading font-semibold text-sm tracking-wide text-white"
            >
              Build Playbook
              <span>→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
