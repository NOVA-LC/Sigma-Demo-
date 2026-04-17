"use client";

import { useEffect, useState } from "react";

import {
  categories,
  tutorialByStep,
  type CategoryId,
} from "@/components/builder/toolboxItems";
import { useWorkflowStore } from "@/store/useWorkflowStore";

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

export default function RemediationCatalog() {
  const tutorialStep = useWorkflowStore((s) => s.tutorialStep);
  const completedItemIds = useWorkflowStore((s) => s.completedItemIds);
  const selectToolboxItem = useWorkflowStore((s) => s.selectToolboxItem);

  const config = tutorialByStep[tutorialStep];
  const activeCategoryId = config.activeCategoryId;
  const activeItemId = config.activeItemId;
  const tooltip = config.tooltip;

  const [expandedId, setExpandedId] = useState<CategoryId | null>(null);

  useEffect(() => {
    setExpandedId(null);
  }, [activeCategoryId]);

  const completedCategoryIds: CategoryId[] = categories
    .filter((c) => c.items.some((i) => completedItemIds.includes(i.id)))
    .map((c) => c.id);

  return (
    <div>
      {categories.map((cat) => {
        const isActive = cat.id === activeCategoryId;
        const isCompleted = completedCategoryIds.includes(cat.id);
        const isDisabled = !isActive && !isCompleted;
        const isExpanded = expandedId === cat.id;

        return (
          <div key={cat.id} className="relative border-b border-white/5">
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
              onClick={() => setExpandedId(isExpanded ? null : cat.id)}
              className={[
                "w-full flex items-center gap-3 pr-5 py-2.5 text-left transition-colors",
                isActive
                  ? "text-white hover:bg-white/[0.04] cursor-pointer pl-[22px]"
                  : isCompleted
                    ? "text-white/85 hover:bg-white/[0.04] cursor-pointer pl-[22px]"
                    : "text-white/40 cursor-not-allowed pl-[22px]",
              ].join(" ")}
            >
              <span className="font-heading font-medium text-[13px] flex-1">
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
                          itemActive && selectToolboxItem(item.id)
                        }
                        className={[
                          "w-full flex items-center gap-3 pl-9 pr-5 py-1.5 text-left transition-colors",
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
                        <span className="text-[12.5px] flex-1 leading-tight">
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
  );
}
