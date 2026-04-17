"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Edge, Node } from "reactflow";

import BuilderHeader from "@/components/builder/BuilderHeader";
import PlaybookCanvas from "@/components/builder/PlaybookCanvas";
import Toolbox from "@/components/builder/Toolbox";
import WelcomeModal from "@/components/builder/WelcomeModal";
import Toast from "@/components/builder/Toast";
import EscalationScreen from "@/components/builder/EscalationScreen";
import MemorizationBanner from "@/components/builder/MemorizationBanner";
import PivotBanner from "@/components/builder/PivotBanner";
import {
  TRIGGER_BORDER_COLOR,
  TRIGGER_NODE_ID,
  itemsById,
  type CategoryId,
} from "@/components/builder/toolboxItems";
import type { WorkflowNodeData } from "@/components/builder/WorkflowNode";
import { useWorkflowStore } from "@/store/useWorkflowStore";

/**
 * Tutorial state machine — each step tells the user exactly what to click.
 */
type TutorialStep =
  | "add-clear-cache"
  | "add-reboot"
  | "deploy"
  | "running"
  | "done";

type TutorialConfig = {
  activeCategoryId: CategoryId | null;
  activeItemId: string | null;
  tooltip: string | null;
  highlightDeploy: boolean;
};

const tutorialByStep: Record<TutorialStep, TutorialConfig> = {
  "add-clear-cache": {
    activeCategoryId: "network",
    activeItemId: "clear-gateway-cache",
    tooltip: "Fastest low-risk attempt.",
    highlightDeploy: false,
  },
  "add-reboot": {
    activeCategoryId: "hardware",
    activeItemId: "reboot-server",
    tooltip: "Fallback if cache fails.",
    highlightDeploy: false,
  },
  deploy: {
    activeCategoryId: null,
    activeItemId: null,
    tooltip: null,
    highlightDeploy: true,
  },
  running: {
    activeCategoryId: null,
    activeItemId: null,
    tooltip: null,
    highlightDeploy: false,
  },
  done: {
    activeCategoryId: null,
    activeItemId: null,
    tooltip: null,
    highlightDeploy: false,
  },
};

const NODE_ID_BY_ITEM: Record<string, string> = {
  "clear-gateway-cache": "node-clear-cache",
  "reboot-server": "node-reboot-server",
};

const POSITION_BY_ITEM: Record<string, { x: number; y: number }> = {
  "clear-gateway-cache": { x: 260, y: 180 },
  "reboot-server": { x: 260, y: 320 },
};

const triggerNode: Node<WorkflowNodeData> = {
  id: TRIGGER_NODE_ID,
  type: "workflow",
  position: { x: 260, y: 40 },
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

// Phase 1 — success cascade timings (relative to click)
const SUCCESS = {
  edgeAfter: 500,
  nodeAfter: 1400,
  stepDuration: 1500,
  memorizationDelay: 500,
};

// Phase 2 — wait after success lands before pivoting
const PIVOT_DWELL_MS = 4000;

// Phase 3 — wait after pivot banner lands before escalating
const ESCALATION_DWELL_MS = 3000;
const NODE_RED_STAGGER_MS = 300;
const ESCALATION_UI_AFTER_RED_MS = 700;

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
  const [tutorialStep, setTutorialStep] =
    useState<TutorialStep>("add-clear-cache");
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([]);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);
  const setPhase = useWorkflowStore((s) => s.setPhase);

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
    setTutorialStep("add-clear-cache");
    setCompletedItemIds([]);
    setPhase("waiting-for-permission");
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [setNodes, setEdges, setPhase]);

  const tutorialConfig = tutorialByStep[tutorialStep];

  const push = (fn: () => void, delay: number) => {
    timeoutsRef.current.push(setTimeout(fn, delay));
  };

  const handleToolboxSelect = useCallback(
    (itemId: string) => {
      const item = itemsById[itemId];
      if (!item) return;

      const nodeId = NODE_ID_BY_ITEM[itemId];
      const position = POSITION_BY_ITEM[itemId];
      if (!nodeId || !position) return;

      const s = useWorkflowStore.getState();

      const newNode: Node<WorkflowNodeData> = {
        id: nodeId,
        type: "workflow",
        position,
        data: {
          kind: "Action",
          label: item.label,
          accentColor: item.accentColor,
          borderColor: "#E2E8F0",
        },
      };

      const parentId =
        itemId === "clear-gateway-cache"
          ? TRIGGER_NODE_ID
          : NODE_ID_BY_ITEM["clear-gateway-cache"];

      const newEdge: Edge = {
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        animated: true,
        style: { stroke: "#94A3B8", strokeWidth: 2 },
      };

      s.setNodes([...s.nodes, newNode]);
      s.setEdges([...s.edges, newEdge]);

      setCompletedItemIds((prev) => [...prev, itemId]);

      if (itemId === "clear-gateway-cache") {
        setTutorialStep("add-reboot");
      } else if (itemId === "reboot-server") {
        setTutorialStep("deploy");
      }
    },
    [],
  );

  const hasSolutionConnected = edges.some(
    (e) =>
      e.source === TRIGGER_NODE_ID &&
      nodes.some((n) => n.id === e.target && n.id !== TRIGGER_NODE_ID),
  );

  /**
   * Single continuous story:
   *   Phase 1: cascade nodes green, fire ROI toast, drop memorization banner.
   *   Phase 2 (after 4 s dwell): clear success UI, show pivot banner.
   *   Phase 3 (after 3 s dwell): flip nodes red, dim screen, show iOS lock.
   */
  const runPlaybook = useCallback(() => {
    const s0 = useWorkflowStore.getState();
    const path = walkFromTrigger(s0.nodes, s0.edges);
    if (path.length === 0) return;

    // ── Phase 1 — Success cascade ───────────────────────────────────────────
    path.forEach((step, idx) => {
      const base = idx * SUCCESS.stepDuration;
      const isLast = idx === path.length - 1;

      // Edge goes solid accent blue
      push(() => {
        const s = useWorkflowStore.getState();
        s.setEdges(
          s.edges.map((e) =>
            e.id === step.edgeId
              ? {
                  ...e,
                  animated: false,
                  style: { stroke: "#0099FF", strokeWidth: 3 },
                }
              : e,
          ),
        );
      }, base + SUCCESS.edgeAfter);

      // Node flips to green + Success badge. Final node also fires the toast.
      push(() => {
        const s = useWorkflowStore.getState();
        s.setNodes(
          s.nodes.map((n) =>
            n.id === step.nodeId
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
        if (isLast) {
          setToastVisible(true);
          setDeployState("deployed");
          setTutorialStep("done");
        }
      }, base + SUCCESS.nodeAfter);
    });

    const phase1NodeEndAt =
      (path.length - 1) * SUCCESS.stepDuration + SUCCESS.nodeAfter;

    // Memorization banner drops right after the final green node.
    const memorizationAt = phase1NodeEndAt + SUCCESS.memorizationDelay;
    push(() => {
      setMemorizationShown(true);
      setPhase("resolved");
    }, memorizationAt);

    // ── Phase 2 — The Pivot ────────────────────────────────────────────────
    const pivotAt = memorizationAt + PIVOT_DWELL_MS;
    push(() => {
      setToastVisible(false);
      setMemorizationShown(false);
      setPivotShown(true);
      // Flip the button back to executing; breadcrumb regresses too.
      setDeployState("executing");
      setPhase("executing");
    }, pivotAt);

    // ── Phase 3 — The Escalation ───────────────────────────────────────────
    const redStartAt = pivotAt + ESCALATION_DWELL_MS;

    // Hide the pivot banner right before the carnage starts, so the user's
    // focus snaps to the nodes flipping red.
    push(() => setPivotShown(false), redStartAt);

    // Cascade each node and its inbound edge from green to red.
    path.forEach((step, idx) => {
      const delay = redStartAt + idx * NODE_RED_STAGGER_MS;
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
      }, delay);
    });

    // Final UI: dim + iOS lock screen. The EscalationScreen owns both the
    // fade-to-black backdrop and the phone slide-up animation.
    const escalationUiAt =
      redStartAt +
      (path.length - 1) * NODE_RED_STAGGER_MS +
      ESCALATION_UI_AFTER_RED_MS;

    push(() => {
      setDeployState("failed");
      setEscalationOpen(true);
    }, escalationUiAt);
  }, [setPhase]);

  const handleDeploy = useCallback(() => {
    if (!hasSolutionConnected || deployState !== "idle") return;

    setDeployState("executing");
    setTutorialStep("running");
    setPhase("executing");

    runPlaybook();
  }, [hasSolutionConnected, deployState, runPlaybook, setPhase]);

  const deployDisabled = !hasSolutionConnected || deployState !== "idle";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global header (breadcrumbs only) with a local sub-row for the page
          title and the Execute Playbook action. */}
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
                <div className="rounded-md bg-slate-900 text-white font-heading font-medium text-[12px] px-3 py-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.35)] whitespace-nowrap">
                  Guardrails set. Run the playbook.
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
                deployState === "idle" && hasSolutionConnected
                  ? tutorialConfig.highlightDeploy
                    ? "bg-primary-navy hover:bg-[#002a47] text-white animate-cta-pulse"
                    : "bg-primary-navy hover:bg-[#002a47] text-white shadow-sm"
                  : deployState === "executing"
                    ? "bg-primary-navy text-white/90 cursor-wait"
                    : deployState === "deployed"
                      ? "bg-emerald-600 text-white"
                      : deployState === "failed"
                        ? "bg-red-600 text-white"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
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

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbox
          activeCategoryId={tutorialConfig.activeCategoryId}
          activeItemId={tutorialConfig.activeItemId}
          tooltip={tutorialConfig.tooltip}
          completedItemIds={completedItemIds}
          onSelect={handleToolboxSelect}
        />
        <PlaybookCanvas>
          {memorizationShown && <MemorizationBanner />}
        </PlaybookCanvas>
      </div>

      {showWelcome && <WelcomeModal onDismiss={() => setShowWelcome(false)} />}

      <Toast
        visible={toastVisible}
        message="Crisis averted. Time saved: 45 minutes. Sleep preserved."
      />

      {pivotShown && <PivotBanner />}

      {escalationOpen && <EscalationScreen />}
    </div>
  );
}
