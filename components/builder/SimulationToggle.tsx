"use client";

import { useWorkflowStore } from "@/store/useWorkflowStore";

type Props = {
  disabled?: boolean;
};

export default function SimulationToggle({ disabled }: Props) {
  const checked = useWorkflowStore((s) => s.isFailureSimulated);
  const setChecked = useWorkflowStore((s) => s.setIsFailureSimulated);

  return (
    <label
      className={`flex items-center gap-3 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="text-right">
        <div className="text-[11px] font-heading font-semibold text-primary-navy/80 leading-tight">
          Simulate Hardware Failure
        </div>
        <div className="text-[9px] font-heading font-medium tracking-[0.14em] text-primary-navy/45 uppercase mt-0.5">
          Toggle for escalation demo
        </div>
      </div>

      <span
        className={`relative inline-flex w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-red-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </label>
  );
}
