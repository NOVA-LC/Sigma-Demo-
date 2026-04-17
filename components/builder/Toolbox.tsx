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
      strokeWidth="1.5"
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
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.75" y="5.5" width="6.5" height="4.25" rx="1" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" />
    </svg>
  );
}

function Check() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className="w-3 h-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 6.5 5 9l4.5-5.5" />
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

  useEffect(() => {
    setExpandedId(null);
  }, [activeCategoryId]);

  const completedCategoryIds: CategoryId[] = categories
    .filter((c) => c.items.some((i) => completedItemIds.includes(i.id)))
    .map((c) => c.id);

  return (
    <aside className="w-1/4 min-w-[280px] bg-primary-navy text-white flex flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="font-heading font-semibold text-[10px] tracking-[0.22em] text-white/50 uppercase">
          Solutions Toolbox
        </div>
        <h2 className="font-heading font-semibold text-base text-white mt-1.5">
          Remediation Catalog
        </h2>
        <p className="text-xs text-white/50 mt-2 leading-relaxed">
          Browse by category. Expand the highlighted one to add its step.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          const isCompleted = completedCategoryIds.includes(cat.id);
          const isDisabled = !isActive && !isCompleted;
          const isExpanded = expandedId === cat.id;

          return (
            <div key={cat.id} className="relative border-b border-white/10">
              {/* Sleek vertical rail marks the active step */}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-blue"
                />
              )}

              <button
                type="button"
                disabled={isDisabled}
                aria-expanded={isExpanded}
                aria-current={isActive ? "step" : undefined}
                onClick={() =>
                  setExpandedId(isExpanded ? null : cat.id)
                }
                className={[
                  "w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors",
                  isActive
                    ? "text-white hover:bg-white/[0.04] cursor-pointer"
                    : isCompleted
                      ? "text-white/85 hover:bg-white/[0.04] cursor-pointer"
                      : "text-white/40 cursor-not-allowed",
                ].join(" ")}
              >
                <span className="font-heading font-medium text-[13.5px] flex-1">
                  {cat.label}
                </span>

                {isDisabled && (
                  <span className="text-white/40">
                    <LockIcon />
                  </span>
                )}

                {isCompleted && (
                  <span className="text-emerald-400">
                    <Check />
                  </span>
                )}

                <span className="text-white/40">
                  <Chevron expanded={isExpanded} />
                </span>
              </button>

              {isExpanded && (
                <div className="pb-1.5">
                  {cat.items.map((item) => {
                    const itemActive =
                      isActive && item.id === activeItemId;
                    const itemCompleted = completedItemIds.includes(item.id);

                    return (
                      <div key={item.id} className="relative">
                        {itemActive && (
                          <span
                            aria-hidden
                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-blue/60"
                          />
                        )}
                        <button
                          type="button"
                          disabled={!itemActive}
                          onClick={() =>
                            itemActive && onSelect(item.id)
                          }
                          className={[
                            "w-full flex items-center gap-3 pl-9 pr-5 py-2 text-left transition-colors",
                            itemActive
                              ? "text-white hover:bg-white/[0.04] cursor-pointer"
                              : itemCompleted
                                ? "text-white/75"
                                : "text-white/30 cursor-not-allowed",
                          ].join(" ")}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${
                              itemActive
                                ? "bg-accent-blue"
                                : itemCompleted
                                  ? "bg-emerald-400"
                                  : "bg-white/25"
                            }`}
                          />
                          <span className="text-[13px] flex-1 leading-tight">
                            {item.label}
                          </span>
                          {itemCompleted && (
                            <span className="text-emerald-400/90">
                              <Check />
                            </span>
                          )}
                        </button>
                        {itemActive && tooltip && (
                          <div className="pl-9 pr-5 pb-2 text-[11px] text-accent-blue/85 leading-snug">
                            {tooltip}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="rounded-lg bg-accent-blue/10 border border-accent-blue/20 p-4 text-sm text-white/80 leading-relaxed">
          <div className="font-heading font-semibold text-white mb-1.5">
            💡 How this works:
          </div>
          <p>
            Order matters. Put your easiest fix first. I will run Step 1 and
            check if the gateway is back online. If it works, I stop. If it
            fails, I automatically move to Step 2.
          </p>
        </div>
      </div>
    </aside>
  );
}
