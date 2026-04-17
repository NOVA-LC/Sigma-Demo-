"use client";

function SignalDots() {
  return (
    <span className="flex items-end gap-[2px]">
      <span className="w-[3px] h-[3px] rounded-[1px] bg-white" />
      <span className="w-[3px] h-[5px] rounded-[1px] bg-white" />
      <span className="w-[3px] h-[7px] rounded-[1px] bg-white" />
      <span className="w-[3px] h-[9px] rounded-[1px] bg-white" />
    </span>
  );
}

function WifiIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 12"
      className="w-3.5 h-[11px] fill-white"
    >
      <path d="M8 11.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3-3a4.2 4.2 0 0 1 6 0l-1.1 1.1a2.7 2.7 0 0 0-3.8 0L5 8.5zm-2-2a7 7 0 0 1 10 0l-1.1 1.1a5.5 5.5 0 0 0-7.8 0L3 6.5zm-2-2a9.9 9.9 0 0 1 14 0l-1.1 1.1a8.3 8.3 0 0 0-11.8 0L1 4.5z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <span className="relative inline-flex items-center">
      <span className="w-6 h-[11px] rounded-[3px] border border-white/80 p-[1.5px] flex items-center">
        <span className="block w-full h-full rounded-[1.5px] bg-white" />
      </span>
      <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[5px] rounded-r-sm bg-white/70" />
    </span>
  );
}

function PhoneGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`w-[18px] h-[18px] fill-white ${className}`}
    >
      <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.1 15.1 0 0 1-6.59-6.58l2.2-2.21a1 1 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1C3 13.39 10.61 21 20 21a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
    </svg>
  );
}

function LockGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="w-[22px] h-[22px] fill-white/85"
    >
      <path d="M17 9h-1V7a4 4 0 1 0-8 0v2H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-5 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3-9H9V7a3 3 0 0 1 6 0v2z" />
    </svg>
  );
}

export default function EscalationScreen() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center animate-fade-to-black">
      {/* Dim-to-black backdrop */}
      <div className="absolute inset-0 bg-black/95" />

      {/* Phone frame */}
      <div
        className="relative w-[360px] max-h-[92vh] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_140px_rgba(0,0,0,0.9)] animate-lock-slide-up"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, #1e2436 0%, #0a0d1a 55%, #05070e 100%)",
        }}
      >
        {/* iOS status bar */}
        <div className="flex justify-between items-center px-7 pt-4 pb-1 text-white">
          <span className="text-[15px] font-semibold tracking-tight">6:16</span>
          <div className="flex items-center gap-[5px]">
            <SignalDots />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        {/* Lock indicator */}
        <div className="flex justify-center pt-5">
          <LockGlyph />
        </div>

        {/* Time + date — iOS SF-style light clock */}
        <div className="text-center text-white pt-3 pb-7">
          <div className="text-[15px] font-light tracking-wide opacity-90">
            Tuesday, May 20
          </div>
          <div
            className="text-[96px] leading-[0.92] tracking-[-0.05em] mt-1"
            style={{ fontWeight: 200 }}
          >
            6:16
          </div>
          <div className="text-[10px] font-medium tracking-[0.36em] opacity-70 mt-1.5">
            AM
          </div>
        </div>

        {/* Push notification — glassmorphism */}
        <div
          className="mx-3 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)] px-3.5 py-3 animate-lock-item-in"
          style={{ animationDelay: "450ms" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[0.65rem] bg-gradient-to-br from-[#33ADFF] to-[#0077CC] flex items-center justify-center font-heading font-semibold text-white shrink-0 shadow-[0_2px_6px_rgba(0,153,255,0.35)]">
              S
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] text-white/70">
                <span className="font-semibold text-white tracking-wide">
                  SIGMA AI
                </span>
                <span>now</span>
              </div>
              <div className="font-semibold text-[14px] text-white mt-0.5 tracking-[-0.01em]">
                Hardware fault — escalating
              </div>
              <div className="text-[13px] text-white/90 leading-snug mt-1 tracking-[-0.005em]">
                Hey boss. John can&apos;t get in. Scanners are completely down.
                I tried clearing the cache and the server, I think it&apos;s a
                hardware fault. I&apos;m tagging you in and going back to bed.
              </div>
            </div>
          </div>
        </div>

        {/* Incoming call — glassmorphism */}
        <div
          className="mx-3 mt-3 mb-5 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)] px-4 py-3.5 animate-lock-item-in"
          style={{ animationDelay: "900ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#33ADFF] to-[#0077CC] flex items-center justify-center font-heading font-semibold text-lg text-white shadow-[0_4px_10px_rgba(0,153,255,0.35)]">
                S
              </div>
              <span className="absolute inset-0 rounded-full border-2 border-[#33ADFF]/50 animate-ping-slow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                Incoming call
              </div>
              <div className="font-semibold text-white text-[15px] leading-tight tracking-[-0.01em]">
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
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(255,59,48,0.45)]"
                style={{ backgroundColor: "#FF3B30" }}
              >
                <PhoneGlyph className="rotate-[135deg]" />
              </button>
              <button
                type="button"
                aria-label="Accept"
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(52,199,89,0.5)] animate-pulse"
                style={{ backgroundColor: "#34C759" }}
              >
                <PhoneGlyph />
              </button>
            </div>
          </div>
        </div>

        {/* iOS home indicator */}
        <div className="flex justify-center pb-3">
          <div className="w-[120px] h-[5px] rounded-full bg-white/55" />
        </div>
      </div>
    </div>
  );
}
