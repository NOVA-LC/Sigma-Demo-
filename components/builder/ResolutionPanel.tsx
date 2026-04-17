"use client";

import { useEffect, useRef, useState } from "react";

import ChatMessage from "@/components/triage/ChatMessage";
import TypingIndicator from "@/components/triage/TypingIndicator";

type Entry =
  | {
      kind: "message";
      id: string;
      author: "Jessica" | "Sigma AI";
      time: string;
      body: React.ReactNode;
    }
  | { kind: "typing"; id: string };

// Jessica's original message arrived at 6:14 AM on the triage screen.
// The resolution reply must land exactly 2 minutes later — 6:16 AM.
const jessicaOriginal: Entry = {
  kind: "message",
  id: "m-jessica-original",
  author: "Jessica",
  time: "6:14 AM",
  body: (
    <>
      <span className="font-semibold text-red-300">
        John&apos;s card isn&apos;t working again.
      </span>{" "}
      Help!
    </>
  ),
};

const aiResolution: Entry = {
  kind: "message",
  id: "m-ai-resolution",
  author: "Sigma AI",
  time: "6:16 AM",
  body: (
    <>
      Sorry that took a second, Jessica! The system is refreshed. John should
      be able to get in now.
    </>
  ),
};

const jessicaThanks: Entry = {
  kind: "message",
  id: "m-jessica-thanks",
  author: "Jessica",
  time: "6:16 AM",
  body: <>It works! Thank you!</>,
};

export default function ResolutionPanel() {
  const [entries, setEntries] = useState<Entry[]>([jessicaOriginal]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const push = (fn: () => void, delay: number) => {
      timeoutsRef.current.push(setTimeout(fn, delay));
    };

    // AI types → posts resolution
    push(() => {
      setEntries((prev) => [...prev, { kind: "typing", id: "typing-ai" }]);
    }, 600);

    push(() => {
      setEntries((prev) =>
        prev.filter((e) => e.id !== "typing-ai").concat(aiResolution),
      );
    }, 1700);

    // Jessica types → posts thanks
    push(() => {
      setEntries((prev) => [...prev, { kind: "typing", id: "typing-jessica" }]);
    }, 2700);

    push(() => {
      setEntries((prev) =>
        prev.filter((e) => e.id !== "typing-jessica").concat(jessicaThanks),
      );
    }, 3600);

    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  return (
    <div
      role="complementary"
      aria-label="Resolution chat"
      className="fixed right-0 top-0 h-screen w-full max-w-[440px] z-40 animate-slide-in-panel"
    >
      <div className="h-full flex flex-col bg-primary-navy border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-heading font-semibold text-[11px] tracking-[0.16em] text-light-gray uppercase">
            Live Chat · YMCA North Branch
          </span>
          <span className="ml-auto text-[10px] font-heading font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5 uppercase tracking-wider">
            Resolved
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {entries.map((entry) =>
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
          )}
        </div>
      </div>
    </div>
  );
}
