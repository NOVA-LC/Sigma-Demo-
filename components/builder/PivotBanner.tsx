"use client";

type Props = {
  visible: boolean;
};

/**
 * Dark full-screen overlay with a single centered premium headline.
 * Always mounted; fades in/out via CSS opacity so the transition text can
 * gracefully disappear before the failure cascade starts.
 */
export default function PivotBanner({ visible }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-500 ease-out ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div
        className={`relative text-center px-10 max-w-2xl transition-all duration-700 ease-out ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2"
        }`}
      >
        <div className="text-[10px] font-heading font-semibold tracking-[0.32em] uppercase text-white/50 mb-4">
          Simulation 2
        </div>
        <div
          className="text-white text-3xl md:text-[38px] leading-[1.15] tracking-tight"
          style={{ fontWeight: 300 }}
        >
          What if the server rack was physically unplugged?
        </div>
      </div>
    </div>
  );
}
