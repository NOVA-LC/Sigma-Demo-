"use client";

import { toolboxItems } from "./toolboxItems";

type Props = {
  activeItemId: string | null;
  tooltip?: string | null;
  completedItemIds: string[];
  onSelect: (itemId: string) => void;
};

export default function Toolbox({
  activeItemId,
  tooltip,
  completedItemIds,
  onSelect,
}: Props) {
  return (
    <aside className="w-1/4 min-w-[260px] bg-primary-navy text-white flex flex-col">
      <div className="px-5 py-5 border-b border-secondary-dark">
        <div className="font-heading font-semibold text-[11px] tracking-[0.2em] text-light-gray/70 uppercase">
          Solutions Toolbox
        </div>
        <h2 className="font-heading font-semibold text-lg text-white mt-1">
          Remediation Steps
        </h2>
        <p className="text-[11px] text-light-gray/60 mt-1.5 leading-relaxed">
          Follow the guided steps. Click each highlighted option to add it to
          the playbook.
        </p>
      </div>

      <div className="flex-1 px-4 py-5 space-y-3">
        {toolboxItems.map((item) => {
          const isActive = activeItemId === item.id;
          const isCompleted = completedItemIds.includes(item.id);
          const isInert = !isActive && !isCompleted;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => isActive && onSelect(item.id)}
              disabled={!isActive}
              className={`w-full text-left rounded-xl border px-4 py-3 transition-colors flex items-center gap-3 ${
                isActive
                  ? "bg-accent-blue/15 border-accent-blue animate-tutorial-pulse cursor-pointer"
                  : isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/40 cursor-default"
                    : "bg-secondary-dark/60 border-white/10 cursor-not-allowed opacity-60"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: isInert
                    ? "rgba(255,255,255,0.25)"
                    : item.accentColor,
                }}
              />
              <span className="font-heading font-semibold text-sm text-white">
                {item.label}
              </span>

              {isCompleted && (
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-heading font-semibold tracking-[0.14em] text-emerald-300 uppercase">
                  <span>✓</span> Added
                </span>
              )}
              {isActive && (
                <span className="ml-auto text-[10px] font-heading font-semibold tracking-[0.14em] text-accent-blue uppercase">
                  Click
                </span>
              )}
            </button>
          );
        })}

        {activeItemId && tooltip && (
          <div
            key={activeItemId}
            className="mt-4 rounded-lg bg-accent-blue text-white text-xs font-heading font-semibold px-3 py-2 shadow-[0_8px_24px_rgba(0,153,255,0.4)] flex items-center gap-2 animate-page-in"
            role="tooltip"
          >
            <span>👆</span>
            {tooltip}
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-secondary-dark text-[10px] text-light-gray/50 leading-snug">
        Tip: every step is a guardrail. If step 1 fails, the next one runs
        automatically.
      </div>
    </aside>
  );
}
