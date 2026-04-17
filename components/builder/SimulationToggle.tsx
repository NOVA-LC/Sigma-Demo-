"use client";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function SimulationToggle({ checked, onChange, disabled }: Props) {
  return (
    <label
      className={`flex items-center gap-2.5 text-[11px] font-heading font-medium text-primary-navy/70 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <span className="tracking-wide uppercase text-[10px] text-primary-navy/50">
        Demo
      </span>
      <span className="text-primary-navy/80">Simulate Hardware Failure</span>
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
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
