"use client";

export default function PivotBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
    >
      <div className="pointer-events-auto animate-pivot-in rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white px-8 py-6 shadow-[0_30px_80px_rgba(245,158,11,0.45)] border border-amber-300/60 max-w-lg text-center">
        <div className="text-[11px] font-heading font-semibold tracking-[0.22em] uppercase text-amber-50/90 mb-2">
          Unexpected condition
        </div>
        <div className="font-heading font-semibold text-xl leading-snug">
          Wait… what if the server rack was physically unplugged?
        </div>
        <div className="text-sm text-amber-50/90 mt-3 font-mono flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          Simulating unrecoverable hardware failure...
        </div>
      </div>
    </div>
  );
}
