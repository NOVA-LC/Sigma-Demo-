"use client";

import { useEffect, useState } from "react";

import ActivePulse from "@/components/ActivePulse";
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

/**
 * Bright "NEXT STEP" callout at the top of the Remediation Catalog.
 * This is the impossible-to-miss instruction.
 */
function NextStepBanner({ text }: { text: string }) {
  return (
    <div className="mx-3 mb-3 mt-1 rounded-lg bg-accent-blue/10 border border-accent-blue/40 shadow-[0_0_20px_rgba(0,153,255,0.25)] px-3 py-2.5 flex items-start gap-2.5 animate-page-in">
      <span className="mt-[3px]">
        <ActivePulse size={2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-heading font-semibold tracking-[0.22em] uppercase text-accent-blue">
          Next step
        </div>
        <div className="text-[12.5px] font-heading font-medium text-white leading-snug mt-0.5">
          {text}
        </div>
      </div>
    </div>
  );
}

export default function RemediationCatalog() {
  const tutorialStep = useWorkflowStore((s) => s.tutorialStep);
  const completedItemIds = useWorkflowStore((s) => s.completedItemIds);
  const selectToolboxItem = useWorkflowStore((s) => s.selectToolboxItem);

  const config = tutorialByStep[tutorialStep];
  const activeCategoryId = config.activeCategoryId;
  const activeItemId = config.activeItemId;
  const categoryPrompt = config.categoryPrompt;
  const itemPrompt = config.itemPrompt;
  const tooltip = config.tooltip;

  const [expandedId, setExpandedId] = useState<CategoryId | null>(null);

  useEffect(() => {
    setExpandedId(null);
  }, [activeCategoryId]);

  const completedCategoryIds: CategoryId[] = categories
    .filter((c) => c.items.some((i) => completedItemIds.includes(i.id)))
    .map((c) => c.id);

  // Banner copy: show the expanded "click the item" prompt once the user has
  // opened the right category; otherwise show the "expand this category" one.
  const activeIsExpanded =
    activeCategoryId !== null && expandedId === activeCategoryId;
  const bannerText =
    activeCategoryId === null
      ? null
      : activeIsExpanded
        ? itemPrompt
        : categoryPrompt;

  return (
    <div>
      {bannerText && <NextStepBanner text={bannerText} />}

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
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-blue shadow-[0_0_10px_rgba(0,153,255,0.6)]"
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
                  ? "text-white bg-accent-blue/5 hover:bg-accent-blue/10 cursor-pointer pl-4"
                  : isCompleted
                    ? "text-white/85 hover:bg-white/[0.04] cursor-pointer pl-[22px]"
                    : "text-white/40 cursor-not-allowed pl-[22px]",
              ].join(" ")}
            >
              {isActive && <ActivePulse size={2} />}

              <span
                className={`font-heading flex-1 ${
                  isActive ? "font-semibold text-[13.5px]" : "font-medium text-[13px]"
                }`}
              >
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

              <span
                className={isActive ? "text-accent-blue" : "text-white/40"}
              >
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
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-accent-blue/70 shadow-[0_0_8px_rgba(0,153,255,0.5)]"
                        />
                      )}
                      <button
                        type="button"
                        disabled={!itemActive}
                        onClick={() =>
                          itemActive && selectToolboxItem(item.id)
                        }
                        className={[
                          "w-full flex items-center gap-2.5 pr-5 py-2 text-left transition-colors",
                          itemActive
                            ? "text-white bg-accent-blue/5 hover:bg-accent-blue/10 cursor-pointer pl-5"
                            : itemCompleted
                              ? "text-white/75 pl-9"
                              : "text-white/30 cursor-not-allowed pl-9",
                        ].join(" ")}
                      >
                        {itemActive ? (
                          <ActivePulse size={1.5} />
                        ) : (
                          <span
                            className={`w-1 h-1 rounded-full ${
                              itemCompleted ? "bg-emerald-400" : "bg-white/25"
                            }`}
                          />
                        )}
                        <span
                          className={`flex-1 leading-tight ${
                            itemActive
                              ? "text-[13px] font-heading font-semibold"
                              : "text-[12.5px]"
                          }`}
                        >
                          {item.label}
                        </span>
                        {itemCompleted && (
                          <span className="text-emerald-400/90">
                            <Check />
                          </span>
                        )}
                      </button>
                      {itemActive && tooltip && (
                        <div className="pl-5 pr-5 pb-2 text-[11px] text-accent-blue/85 leading-snug">
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
