"use client";

export default function MemorizationBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute top-4 left-4 right-4 z-10 animate-slide-down-banner"
    >
      <div className="rounded-xl bg-white border border-emerald-400/50 shadow-[0_10px_30px_rgba(16,185,129,0.18)] pl-3 pr-5 py-3 flex items-center gap-3.5">
        <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
          ✓
        </span>
        <div className="min-w-0">
          <div className="font-heading font-semibold text-[13.5px] text-primary-navy leading-snug">
            Playbook saved to Active Guardrails.
          </div>
          <div className="text-[12px] text-primary-navy/70 leading-snug mt-0.5">
            Future &quot;Gateway Offline&quot; incidents will auto-remediate.
          </div>
        </div>
      </div>
    </div>
  );
}
