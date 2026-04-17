"use client";

import { useEffect, useRef } from "react";

type Props = {
  logs: string[];
};

export default function ExecutionLogs({ logs }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-[380px] h-[620px] rounded-xl shadow-sm bg-primary-navy flex flex-col overflow-hidden border border-secondary-dark">
      <div className="flex items-center gap-2 px-4 py-3 bg-secondary-dark border-b border-black/30">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-3 font-heading font-semibold text-xs tracking-wider text-light-gray uppercase">
          Execution Logs
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-light-gray"
      >
        {logs.length === 0 ? (
          <div className="text-light-gray/50 italic">
            Awaiting workflow execution...
          </div>
        ) : (
          logs.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              <span className="text-accent-blue">&gt;</span> {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
