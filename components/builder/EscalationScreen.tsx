"use client";

export default function EscalationScreen() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center animate-fade-to-black">
      {/* dim-to-black backdrop */}
      <div className="absolute inset-0 bg-black/95" />

      {/* Phone frame */}
      <div className="relative w-[360px] max-h-[92vh] rounded-[3.25rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.85)] border border-white/10 animate-lock-slide-up bg-[linear-gradient(165deg,#0b0b22_0%,#1a1636_45%,#060612_100%)]">
        {/* Status bar */}
        <div className="flex justify-between items-center px-8 pt-4 pb-1 text-white text-[11px] font-semibold tracking-wide">
          <span>3:16</span>
          <div className="flex items-center gap-1 opacity-90">
            <span>•••</span>
            <span>􀙈</span>
            <span>100%</span>
          </div>
        </div>

        {/* Lock icon */}
        <div className="flex justify-center pt-6">
          <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-[11px]">
            🔒
          </span>
        </div>

        {/* Time + date */}
        <div className="text-center text-white pt-3 pb-6">
          <div className="text-[13px] opacity-80 tracking-wide">
            Tuesday, May 20
          </div>
          <div className="text-[86px] font-light leading-none tracking-tight mt-1">
            3:16
          </div>
        </div>

        {/* Notification */}
        <div
          className="mx-3 rounded-[1.25rem] bg-white/10 backdrop-blur-xl border border-white/10 px-3.5 py-3 animate-lock-item-in"
          style={{ animationDelay: "450ms" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[0.6rem] bg-accent-blue flex items-center justify-center font-heading font-semibold text-white shrink-0">
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span className="font-heading font-semibold text-white tracking-wide">
                  SIGMA AI
                </span>
                <span>now</span>
              </div>
              <div className="font-heading font-semibold text-[13px] text-white mt-0.5">
                Hardware fault — escalating
              </div>
              <div className="text-[12.5px] text-white/90 leading-snug mt-1">
                Hey boss. John can&apos;t get in. Scanners are completely down.
                I tried clearing the cache and the server, I think it&apos;s a
                hardware fault. I&apos;m tagging you in and going back to bed.
              </div>
            </div>
          </div>
        </div>

        {/* Incoming call */}
        <div
          className="mx-3 mt-3 mb-5 rounded-[1.25rem] bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-3.5 animate-lock-item-in"
          style={{ animationDelay: "900ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center font-heading font-semibold text-lg text-white">
                S
              </div>
              <span className="absolute inset-0 rounded-full border-2 border-accent-blue/50 animate-ping-slow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                Incoming call
              </div>
              <div className="font-heading font-semibold text-white text-[15px] leading-tight">
                Sigma AI
              </div>
              <div className="text-[11px] text-white/70 mt-0.5">
                mobile · Ringing…
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                aria-label="Decline"
                className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-sm shadow-lg"
              >
                ✕
              </button>
              <button
                type="button"
                aria-label="Accept"
                className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm shadow-lg animate-pulse"
              >
                ✓
              </button>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-3">
          <div className="w-28 h-1 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
