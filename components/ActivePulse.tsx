"use client";

type Props = {
  /** Tailwind size class for the inner dot. Defaults to 2 (8px). */
  size?: 1.5 | 2 | 2.5;
};

const dotSizeClass: Record<NonNullable<Props["size"]>, string> = {
  1.5: "w-1.5 h-1.5",
  2: "w-2 h-2",
  2.5: "w-2.5 h-2.5",
};

/**
 * Bright-blue "active step" pulse with a heavy ripple. Used to mark the single
 * next thing the user should click anywhere in the sidebar.
 */
export default function ActivePulse({ size = 2 }: Props) {
  const sizeClass = dotSizeClass[size];
  return (
    <span
      aria-hidden
      className={`relative inline-flex items-center justify-center ${sizeClass} shrink-0`}
    >
      <span
        className={`absolute inline-flex ${sizeClass} rounded-full bg-[#0099FF] opacity-75 animate-ping`}
      />
      <span
        className={`relative inline-flex rounded-full ${sizeClass} bg-[#0099FF] shadow-[0_0_10px_rgba(0,153,255,0.8)]`}
      />
    </span>
  );
}
