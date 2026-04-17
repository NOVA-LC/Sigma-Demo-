"use client";

type Props = {
  visible: boolean;
  message: string;
};

export default function Toast({ visible, message }: Props) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-page-in">
      <div className="flex items-center gap-3 rounded-full bg-primary-navy text-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-emerald-400/40 pl-3 pr-6 py-3">
        <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
          ✓
        </span>
        <span className="font-heading font-semibold text-sm tracking-wide">
          {message}
        </span>
      </div>
    </div>
  );
}
