"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Edge, Node } from "reactflow";

import BuilderHeader from "@/components/builder/BuilderHeader";
import PlaybookCanvas from "@/components/builder/PlaybookCanvas";
import WelcomeModal from "@/components/builder/WelcomeModal";
import Toast from "@/components/builder/Toast";
import EscalationScreen from "@/components/builder/EscalationScreen";
import MemorizationBanner from "@/components/builder/MemorizationBanner";
import PivotBanner from "@/components/builder/PivotBanner";
import {
  TRIGGER_BORDER_COLOR,
  TRIGGER_NODE_ID,
  tutorialByStep,
} from "@/components/builder/toolboxItems";
import type { WorkflowNodeData } from "@/components/builder/WorkflowNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

const triggerNode: Node<WorkflowNodeData> = {
  id: TRIGGER_NODE_ID,
  type: "workflow",
  position: { x: 250, y: 50 },
  draggable: false,
  deletable: false,
  selectable: false,
  data: {
    kind: "Trigger",
    label: "Scanner Gateway Offline",
    accentColor: TRIGGER_BORDER_COLOR,
    borderColor: TRIGGER_BORDER_COLOR,
  },
};

// ── Timing constants (all milliseconds from Execute click) ─────────────────
//
// The sequence tells a three-act story:
//   1. Scenario 1 (Success):  Step 1 works, Step 2 never runs.
//   2. Pivot:                 Dim screen, ask the "what if" question.
//   3. Scenario 2 (Failure):  Reset, try Step 1, it fails, fall through to
//                             Step 2, that also fails, escalate.
//
// Timings are intentionally slow so the user can read each beat.

const SUCCESS_EDGE_AT = 600; // edge Trigger → ClearCache lights up blue
const SUCCESS_NODE_AT = 1500; // ClearCache turns green + toast fires
const MEMORIZATION_AT = 2000; // memorization banner drops + phase=resolved

const SUCCESS_DWELL_MS = 7000; // user gets 7s to read the success state
const PIVOT_SHOW_AT = MEMORIZATION_AT + SUCCESS_DWELL_MS; // 9000

const PIVOT_TEXT_MS = 4000; // "Simulation 2" text sits for 4s
const PIVOT_FADE_MS = 500; // smooth fade of the dark overlay
const PIVOT_HIDE_AT = PIVOT_SHOW_AT + PIVOT_TEXT_MS; // 13000

const FAIL_RESET_AT = PIVOT_HIDE_AT + PIVOT_FADE_MS; // 13500
const FAIL_FIRST_EDGE_AT = FAIL_RESET_AT + 300; // 13800
const FAIL_STEP_GAP_MS = 1700; // edge-to-edge spacing inside the failure cascade
const FAIL_NODE_AFTER_EDGE_MS = 900; // edge red → node red lag
const ESCALATION_AFTER_LAST_FAIL_MS = 900;

function walkFromTrigger(
  nodes: Node[],
  edges: Edge[],
): Array<{ nodeId: string; edgeId: string }> {
  const visited = new Set<string>([TRIGGER_NODE_ID]);
  const path: Array<{ nodeId: string; edgeId: string }> = [];
  let current = TRIGGER_NODE_ID;

  while (true) {
    const next = edges.find(
      (e) => e.source === current && !visited.has(e.target),
    );
    if (!next) break;
    if (!nodes.some((n) => n.id === next.target)) break;
    path.push({ nodeId: next.target, edgeId: next.id });
    visited.add(next.target);
    current = next.target;
  }

  return path;
}

type DeployState = "idle" | "executing" | "deployed" | "failed";

export default function PlaybookBuilderPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [deployState, setDeployState] = useState<DeployState>("idle");
  const [toastVisible, setToastVisible] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [memorizationShown, setMemorizationShown] = useState(false);
  const [pivotShown, setPivotShown] = useState(false);

  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);
  const setPhase = useWorkflowStore((s) => s.setPhase);
  const tutorialStep = useWorkflowStore((s) => s.tutorialStep);
  const setTutorialStep = useWorkflowStore((s) => s.setTutorialStep);
  const resetTutorial = useWorkflowStore((s) => s.resetTutorial);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Seed a fresh canvas + reset tutorial on mount
  useEffect(() => {
    setNodes([triggerNode]);
    setEdges([]);
    setDeployState("idle");
    setToastVisible(false);
    setEscalationOpen(false);
    setMemorizationShown(false);
    setPivotShown(false);
    resetTutorial();
    setPhase("waiting-for-permission");
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [setNodes, setEdges, setPhase, resetTutorial]);

  const tutorialConfig = tutorialByStep[tutorialStep];

  const push = (fn: () => void, delay: number) => {
    timeoutsRef.current.push(setTimeout(fn, delay));
  };

  // Strict gate: the tutorial must have reached the "deploy" step, which only
  // happens after BOTH Clear Gateway Cache and Reboot Server have been added.
  const tutorialReady = tutorialStep === "deploy";

  const runPlaybook = useCallback(() => {
    const s0 = useWorkflowStore.getState();
    const path = walkFromTrigger(s0.nodes, s0.edges);
    if (path.length === 0) return;

    const firstStep = path[0]; // Trigger → Clear Gateway Cache

    // ── Act 1 — Success: Step 1 works, we stop ─────────────────────────────
    // Edge Trigger → Clear Gateway Cache turns solid accent blue.
    push(() => {
      const s = useWorkflowStore.getState();
      s.setEdges(
        s.edges.map((e) =>
          e.id === firstStep.edgeId
            ? {
                ...e,
                animated: false,
                style: { stroke: "#0099FF", strokeWidth: 3 },
              }
            : e,
        ),
      );
    }, SUCCESS_EDGE_AT);

    // Clear Gateway Cache turns green. Toast fires.
    // Reboot Server is NEVER touched — it stays gray because Step 1 succeeded.
    push(() => {
      const s = useWorkflowStore.getState();
      s.setNodes(
        s.nodes.map((n) =>
          n.id === firstStep.nodeId
            ? {
                ...n,
                data: {
                  ...(n.data as WorkflowNodeData),
                  borderColor: "#10B981",
                  success: true,
                  failed: false,
                },
              }
            : n,
        ),
      );
      setToastVisible(true);
      setDeployState("deployed");
      setTutorialStep("done");
    }, SUCCESS_NODE_AT);

    // Memorization banner drops; breadcrumb → "Resolved & Memorized".
    push(() => {
      setMemorizationShown(true);
      setPhase("resolved");
    }, MEMORIZATION_AT);

    // ── Act 2 — The Pivot ──────────────────────────────────────────────────
    // After a long 7s dwell the success artefacts disappear, the screen
    // dims, and the "Simulation 2" headline fades in.
    push(() => {
      setToastVisible(false);
      setMemorizationShown(false);
      setPivotShown(true);
      setDeployState("executing");
      setPhase("executing");
    }, PIVOT_SHOW_AT);

    // Pivot text sits for PIVOT_TEXT_MS, then the overlay fades out.
    push(() => setPivotShown(false), PIVOT_HIDE_AT);

    // ── Act 3 — Failure cascade ────────────────────────────────────────────
    // 1. Reset every action node + every edge to the idle state so the user
    //    sees a clean slate before the red run begins.
    push(() => {
      const s = useWorkflowStore.getState();
      s.setNodes(
        s.nodes.map((n) => {
          if (n.id === TRIGGER_NODE_ID) return n;
          return {
            ...n,
            data: {
              ...(n.data as WorkflowNodeData),
              borderColor: "#E2E8F0",
              success: false,
              failed: false,
            },
          };
        }),
      );
      s.setEdges(
        s.edges.map((e) => ({
          ...e,
          animated: true,
          style: { stroke: "#94A3B8", strokeWidth: 2 },
        })),
      );
    }, FAIL_RESET_AT);

    // 2. Walk each step in order: edge → red, then node → red + Failed badge.
    path.forEach((step, idx) => {
      const edgeAt = FAIL_FIRST_EDGE_AT + idx * FAIL_STEP_GAP_MS;
      const nodeAt = edgeAt + FAIL_NODE_AFTER_EDGE_MS;

      push(() => {
        const s = useWorkflowStore.getState();
        s.setEdges(
          s.edges.map((e) =>
            e.id === step.edgeId
              ? {
                  ...e,
                  animated: false,
                  style: { stroke: "#EF4444", strokeWidth: 3 },
                }
              : e,
          ),
        );
      }, edgeAt);

      push(() => {
        const s = useWorkflowStore.getState();
        s.setNodes(
          s.nodes.map((n) =>
            n.id === step.nodeId
              ? {
                  ...n,
                  data: {
                    ...(n.data as WorkflowNodeData),
                    borderColor: "#EF4444",
                    success: false,
                    failed: true,
                  },
                }
              : n,
          ),
        );
      }, nodeAt);
    });

    // 3. Guardrails exhausted → iOS lock screen slides up.
    const lastNodeAt =
      FAIL_FIRST_EDGE_AT +
      (path.length - 1) * FAIL_STEP_GAP_MS +
      FAIL_NODE_AFTER_EDGE_MS;
    const escalationUiAt = lastNodeAt + ESCALATION_AFTER_LAST_FAIL_MS;
    push(() => {
      setDeployState("failed");
      setEscalationOpen(true);
    }, escalationUiAt);
  }, [setPhase, setTutorialStep]);

  const handleDeploy = useCallback(() => {
    if (!tutorialReady || deployState !== "idle") return;

    setDeployState("executing");
    setTutorialStep("running");
    setPhase("executing");

    runPlaybook();
  }, [tutorialReady, deployState, runPlaybook, setPhase, setTutorialStep]);

  const deployDisabled = !tutorialReady || deployState !== "idle";

  return (
    <div className="flex flex-col h-screen">
      <BuilderHeader>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-[11px] font-heading font-semibold tracking-[0.18em] text-primary-navy/60 uppercase mb-1">
              Builder
            </p>
            <h1 className="font-heading font-semibold text-2xl text-primary-navy">
              Playbook Builder
            </h1>
          </div>

          <div className="flex items-center gap-3.5">
            {tutorialConfig.highlightDeploy && deployState === "idle" && (
              <div
                role="tooltip"
                className="relative animate-page-in animate-tooltip-bob"
              >
                <div className="rounded-md bg-slate-900 text-white font-heading font-semibold text-[12px] px-3 py-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.45)] whitespace-nowrap border border-white/5">
                  System ready. Execute the playbook now.
                </div>
                <span
                  aria-hidden
                  className="absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-b-[5px] border-l-[5px] border-t-transparent border-b-transparent border-l-slate-900"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleDeploy}
              disabled={deployDisabled}
              className={`font-heading font-semibold text-[13px] px-4 py-2 rounded-md transition-all inline-flex items-center gap-2 ${
                deployState === "idle" && tutorialReady
                  ? "bg-primary-navy hover:bg-[#002a47] text-white cursor-pointer animate-cta-pulse shadow-[0_0_20px_rgba(0,153,255,0.5)]"
                  : deployState === "executing"
                    ? "bg-primary-navy text-white/90 cursor-wait"
                    : deployState === "deployed"
                      ? "bg-emerald-600 text-white"
                      : deployState === "failed"
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 opacity-50"
              }`}
            >
              {deployState === "executing" && (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spinner" />
              )}
              {deployState === "deployed" && <span>✓</span>}
              {deployState === "failed" && <span>✕</span>}
              <span>
                {deployState === "idle"
                  ? "Execute Playbook"
                  : deployState === "executing"
                    ? "Executing..."
                    : deployState === "deployed"
                      ? "Executed"
                      : "Failed"}
              </span>
            </button>
          </div>
        </div>
      </BuilderHeader>

      {/* Canvas fills all remaining space below the header */}
      <div className="flex-1 w-full h-full overflow-hidden flex">
        <PlaybookCanvas>
          {memorizationShown && <MemorizationBanner />}
        </PlaybookCanvas>
      </div>

      {showWelcome && <WelcomeModal onDismiss={() => setShowWelcome(false)} />}

      <Toast
        visible={toastVisible}
        message="Crisis averted. Time saved: 45 minutes. Sleep preserved."
      />

      <PivotBanner visible={pivotShown} />

      {escalationOpen && <EscalationScreen />}
    </div>
  );
}
