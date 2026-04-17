"use client";

import { useEffect, useState } from "react";

import { categories, type CategoryId } from "./toolboxItems";

type Props = {
  activeCategoryId: CategoryId | null;
  activeItemId: string | null;
  tooltip?: string | null;
  completedItemIds: string[];
  onSelect: (itemId: string) => void;
};

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`w-3 h-3 transition-transform duration-200 ${
        expanded ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.75" y="5.5" width="6.5" height="4.25" rx="1" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
    </svg>
  );
}

export default function Toolbox({
  activeCategoryId,
  activeItemId,
  tooltip,
  completedItemIds,
  onSelect,
}: Props) {
  const [expandedId, setExpandedId] = useState<CategoryId | null>(null);

  // Collapse any open accordion when the tutorial step advances so the next
  // pulsing category is the visual focal point.
  useEffect(() => {
    setExpandedId(null);
  }, [activeCategoryId]);

  // A category is "completed" when at least one of its items has been added.
  const completedCategoryIds: CategoryId[] = categories
    .filter((c) => c.items.some((i) => completedItemIds.includes(i.id)))
    .map((c) => c.id);

  return (
    <aside className="w-1/4 min-w-[280px] bg-primary-navy text-white flex flex-col">
      <div className="px-5 py-5 border-b border-secondary-dark">
        <div className="font-heading font-semibold text-[11px] tracking-[0.2em] text-light-gray/70 uppercase">
          Solutions Toolbox
        </div>
        <h2 className="font-heading font-semibold text-lg text-white mt-1">
          Remediation Catalog
        </h2>
        <p className="text-[11px] text-light-gray/60 mt-1.5 leading-relaxed">
          Browse by category. Expand the highlighted one to add its step to
          your playbook.
        </p>
      </div>

      <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          const isCompleted = completedCategoryIds.includes(cat.id);
          const isDisabled = !isActive && !isCompleted;
          const isExpanded = expandedId === cat.id;

          const headerClass = [
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors",
            isActive
              ? "bg-accent-blue/15 border-accent-blue text-white animate-tutorial-pulse cursor-pointer"
              : isCompleted
                ? "bg-emerald-500/10 border-emerald-500/40 text-white cursor-pointer"
                : "bg-secondary-dark/60 border-white/10 text-light-gray/70 cursor-not-allowed opacity-60",
          ].join(" ");

          return (
            <div key={cat.id}>
              <button
                type="button"
                disabled={isDisabled}
                aria-expanded={isExpanded}
                aria-current={isActive ? "step" : undefined}
                onClick={() =>
                  setExpandedId(isExpanded ? null : cat.id)
                }
                className={headerClass}
              >
                <span className="font-heading font-semibold text-sm flex-1 text-left">
                  {cat.label}
                </span>

                {isDisabled && (
                  <span className="text-light-gray/50">
                    <LockIcon />
                  </span>
                )}

                {isCompleted && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] leading-none">
                    ✓
                  </span>
                )}

                {isActive && !isCompleted && (
                  <span className="text-[10px] font-heading font-semibold tracking-[0.14em] text-accent-blue uppercase">
                    Open
                  </span>
                )}

                <Chevron expanded={isExpanded} />
              </button>

              {isExpanded && (
                <ul className="mt-1.5 ml-2 pl-3 border-l border-white/10 space-y-1.5 py-1.5">
                  {cat.items.map((item) => {
                    const itemActive =
                      isActive && item.id === activeItemId;
                    const itemCompleted = completedItemIds.includes(item.id);

                    const itemClass = [
                      "w-full text-left rounded-md px-3 py-2 transition-colors flex items-center gap-2 border",
                      itemActive
                        ? "bg-accent-blue/20 border-accent-blue text-white animate-tutorial-pulse cursor-pointer"
                        : itemCompleted
                          ? "bg-emerald-500/10 border-emerald-500/40 text-white cursor-default"
                          : "bg-transparent border-transparent text-light-gray/45 cursor-not-allowed",
                    ].join(" ");

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          disabled={!itemActive}
                          onClick={() =>
                            itemActive && onSelect(item.id)
                          }
                          className={itemClass}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              itemActive
                                ? "bg-accent-blue"
                                : itemCompleted
                                  ? "bg-emerald-400"
                                  : "bg-light-gray/30"
                            }`}
                          />
                          <span className="flex-1 min-w-0">
                            <span className="block font-heading font-medium text-[13px] leading-tight">
                              {item.label}
                            </span>
                            {itemActive && tooltip && (
                              <span className="block text-[10.5px] text-accent-blue/90 mt-0.5 leading-snug">
                                {tooltip}
                              </span>
                            )}
                          </span>
                          {itemCompleted && (
                            <span className="text-[10px] font-heading font-semibold tracking-[0.14em] text-emerald-300 uppercase">
                              Added
                            </span>
                          )}
                          {itemActive && (
                            <span className="text-[10px] font-heading font-semibold tracking-[0.14em] text-accent-blue uppercase">
                              Click
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-5 py-4 border-t border-secondary-dark text-[10px] text-light-gray/50 leading-snug">
        Tip: every step is a guardrail. If step 1 fails, the next one runs
        automatically.
      </div>
    </aside>
  );
}
