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
    <ol className="flex items-center gap-1.5">
      {steps.map((step, i) => {
        const state: StepState =
          i < activeIdx ? "done" : i === activeIdx ? "active" : "pending";

        const baseClass =
          "inline-flex items-center gap-1.5 px-1.5 py-0.5 text-[11px] font-heading font-medium tracking-wide";

        return (
          <li key={step.id} className="flex items-center gap-1.5">
            {state === "active" ? (
              <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 text-[11px] font-heading font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {step.label}
              </span>
            ) : state === "done" ? (
              <span className={`${baseClass} text-slate-500`}>
                {step.label}
              </span>
            ) : (
              <span className={`${baseClass} text-slate-400`}>
                {step.label}
              </span>
            )}

            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="text-slate-300 text-[11px] select-none"
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
