"use client";

type Props = {
  onDismiss: () => void;
};

export default function WelcomeModal({ onDismiss }: Props) {
  return (
    <div
      role="dialog"
      aria-modal
      aria-labelledby="welcome-heading"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-primary-navy/70 backdrop-blur-sm animate-page-in"
        onClick={onDismiss}
      />

      <div className="relative max-w-lg w-[90%] rounded-2xl bg-white shadow-2xl border border-white/10 p-8 animate-page-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent-blue text-white font-heading font-semibold flex items-center justify-center">
            S
          </div>
          <div className="text-[11px] font-heading font-semibold tracking-[0.18em] text-primary-navy/60 uppercase">
            Sigma AI
          </div>
        </div>

        <h2
          id="welcome-heading"
          className="font-heading font-semibold text-2xl text-primary-navy mb-3"
        >
          Permission to Fix
        </h2>

        <p className="text-sm text-primary-navy/80 leading-relaxed">
          I found the problem: the Scanner Gateway is down. But before I touch
          the system, I need your permission. Give me the exact steps
          I&apos;m allowed to try. If those don&apos;t work, I won&apos;t
          guess. I&apos;ll stop and wake you up.
        </p>

        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full bg-accent-blue hover:bg-[#33ADFF] transition-colors text-white font-heading font-semibold text-sm px-6 py-2.5 shadow-[0_0_24px_rgba(0,153,255,0.35)]"
          >
            Set up guardrails
          </button>
        </div>
      </div>
    </div>
  );
}
