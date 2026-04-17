"use client";

import { useWorkflowStore, type Phase } from "@/store/useWorkflowStore";

const steps: { id: Phase; label: string }[] = [
  { id: "watching", label: "Watching" },
  { id: "investigating", label: "Investigating" },
  { id: "waiting-for-permission", label: "Waiting for Permission" },
  { id: "executing", label: "Executing" },
  { id: "resolved", label: "Resolved & Memorized" },
];

type StepState = "done" | "active" | "pending";

export default function StatusBreadcrumbs() {
  const phase = useWorkflowStore((s) => s.phase);
  const activeIdx = steps.findIndex((s) => s.id === phase);

  return (
    <ol className="flex items-center gap-1">
      {steps.map((step, i) => {
        const state: StepState =
          i < activeIdx ? "done" : i === activeIdx ? "active" : "pending";

        return (
          <li key={step.id} className="flex items-center gap-1">
            <span
              className={
                state === "active"
                  ? "inline-flex items-center gap-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/30 px-2.5 py-1 text-[11px] font-heading font-semibold text-accent-blue"
                  : state === "done"
                    ? "inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-heading font-medium text-primary-navy/70"
                    : "inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-heading font-medium text-primary-navy/35"
              }
            >
              {state === "done" ? (
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center leading-none">
                  ✓
                </span>
              ) : state === "active" ? (
                <span className="relative w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-accent-blue animate-ping-slow" />
                  <span className="relative block w-2 h-2 rounded-full bg-accent-blue" />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full border border-primary-navy/25" />
              )}
              <span>{step.label}</span>
            </span>

            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="text-primary-navy/25 text-[11px] select-none"
              >
                ›
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
