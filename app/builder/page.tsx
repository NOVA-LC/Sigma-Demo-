"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Edge, Node } from "reactflow";

import PlaybookCanvas from "@/components/builder/PlaybookCanvas";
import Toolbox from "@/components/builder/Toolbox";
import WelcomeModal from "@/components/builder/WelcomeModal";
import ResolutionPanel from "@/components/builder/ResolutionPanel";
import Toast from "@/components/builder/Toast";
import SimulationToggle from "@/components/builder/SimulationToggle";
import EscalationScreen from "@/components/builder/EscalationScreen";
import {
  TRIGGER_BORDER_COLOR,
  TRIGGER_NODE_ID,
  toolboxItems,
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
  toolboxActiveId: string | null;
  tooltip: string | null;
  highlightDeploy: boolean;
};

const tutorialByStep: Record<TutorialStep, TutorialConfig> = {
  "add-clear-cache": {
    toolboxActiveId: "clear-gateway-cache",
    tooltip: "Click to add first attempt",
    highlightDeploy: false,
  },
  "add-reboot": {
    toolboxActiveId: "reboot-server",
    tooltip: "Click to add fallback",
    highlightDeploy: false,
  },
  deploy: {
    toolboxActiveId: null,
    tooltip: null,
    highlightDeploy: true,
  },
  running: {
    toolboxActiveId: null,
    tooltip: null,
    highlightDeploy: false,
  },
  done: {
    toolboxActiveId: null,
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

// Success & failure timings (unchanged from previous iteration)
const SUCCESS = { edge: 1000, node: 2500, panel: 3500, toast: 8000 };
const FAIL = {
  edgeAfter: 700,
  nodeAfter: 1900,
  stepDuration: 2400,
  escalationExtra: 900,
};

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
  const [resolutionOpen, setResolutionOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [tutorialStep, setTutorialStep] =
    useState<TutorialStep>("add-clear-cache");
  const [completedItemIds, setCompletedItemIds] = useState<string[]>([]);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const setNodes = useWorkflowStore((s) => s.setNodes);
  const setEdges = useWorkflowStore((s) => s.setEdges);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Seed a fresh canvas + reset tutorial on mount
  useEffect(() => {
    setNodes([triggerNode]);
    setEdges([]);
    setDeployState("idle");
    setResolutionOpen(false);
    setToastVisible(false);
    setEscalationOpen(false);
    setTutorialStep("add-clear-cache");
    setCompletedItemIds([]);
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [setNodes, setEdges]);

  const tutorialConfig = tutorialByStep[tutorialStep];

  const push = (fn: () => void, delay: number) => {
    timeoutsRef.current.push(setTimeout(fn, delay));
  };

  const handleToolboxSelect = useCallback(
    (itemId: string) => {
      const item = toolboxItems.find((i) => i.id === itemId);
      if (!item) return;

      const nodeId = NODE_ID_BY_ITEM[itemId];
      const position = POSITION_BY_ITEM[itemId];
      if (!nodeId || !position) return;

      const s = useWorkflowStore.getState();

      // Build the new node
      const newNode: Node<WorkflowNodeData> = {
        id: nodeId,
        type: "workflow",
        position,
        data: {
          kind: "Action",
          label: item.label,
          accentColor: item.accentColor,
          borderColor: "#CBD5E1",
        },
      };

      // Determine parent: Trigger for the first step, previous node for the next
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

  const runSuccessSequence = useCallback(() => {
    const s0 = useWorkflowStore.getState();
    const first = s0.edges.find((e) => e.source === TRIGGER_NODE_ID);
    if (!first) return;
    const targetNodeId = first.target;

    push(() => {
      const s = useWorkflowStore.getState();
      s.setEdges(
        s.edges.map((e) =>
          e.id === first.id
            ? {
                ...e,
                animated: false,
                style: { stroke: "#0099FF", strokeWidth: 3 },
              }
            : e,
        ),
      );
    }, SUCCESS.edge);

    push(() => {
      const s = useWorkflowStore.getState();
      s.setNodes(
        s.nodes.map((n) =>
          n.id === targetNodeId
            ? {
                ...n,
                data: {
                  ...(n.data as WorkflowNodeData),
                  borderColor: "#10B981",
                  success: true,
                },
              }
            : n,
        ),
      );
      setDeployState("deployed");
      setTutorialStep("done");
    }, SUCCESS.node);

    push(() => setResolutionOpen(true), SUCCESS.panel);
    push(() => setToastVisible(true), SUCCESS.toast);
  }, []);

  const runFailureSequence = useCallback(() => {
    const s0 = useWorkflowStore.getState();
    const path = walkFromTrigger(s0.nodes, s0.edges);
    if (path.length === 0) return;

    path.forEach((step, idx) => {
      const base = idx * FAIL.stepDuration;

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
      }, base + FAIL.edgeAfter);

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
                    failed: true,
                  },
                }
              : n,
          ),
        );
      }, base + FAIL.nodeAfter);
    });

    const escalationAt =
      path.length * FAIL.stepDuration + FAIL.escalationExtra;

    push(() => {
      setDeployState("failed");
      setTutorialStep("done");
      setEscalationOpen(true);
    }, escalationAt);
  }, []);

  const handleDeploy = useCallback(() => {
    if (!hasSolutionConnected || deployState !== "idle") return;

    setDeployState("executing");
    setTutorialStep("running");

    if (simulateFailure) {
      runFailureSequence();
    } else {
      runSuccessSequence();
    }
  }, [
    hasSolutionConnected,
    deployState,
    simulateFailure,
    runSuccessSequence,
    runFailureSequence,
  ]);

  const deployDisabled = !hasSolutionConnected || deployState !== "idle";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200 gap-6">
        <div>
          <p className="text-[11px] font-heading font-semibold tracking-[0.18em] text-primary-navy/60 uppercase mb-1">
            Builder
          </p>
          <h1 className="font-heading font-semibold text-2xl text-primary-navy">
            Playbook Builder
          </h1>
        </div>

        <div className="flex items-center gap-5">
          <SimulationToggle
            checked={simulateFailure}
            onChange={setSimulateFailure}
            disabled={deployState !== "idle"}
          />

          <button
            type="button"
            onClick={handleDeploy}
            disabled={deployDisabled}
            className={`font-heading font-semibold text-sm px-6 py-2.5 rounded-full transition-all shadow-sm inline-flex items-center gap-2 ${
              deployState === "idle" && hasSolutionConnected
                ? tutorialConfig.highlightDeploy
                  ? "bg-accent-blue hover:bg-[#33ADFF] text-white animate-tutorial-pulse"
                  : "bg-accent-blue hover:bg-[#33ADFF] text-white shadow-[0_0_24px_rgba(0,153,255,0.35)]"
                : deployState === "executing"
                  ? "bg-accent-blue/80 text-white cursor-wait"
                  : deployState === "deployed"
                    ? "bg-emerald-500 text-white"
                    : deployState === "failed"
                      ? "bg-red-500 text-white"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {deployState === "executing" && (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spinner" />
            )}
            {deployState === "deployed" && <span>✓</span>}
            {deployState === "failed" && <span>✕</span>}
            <span>
              {deployState === "idle"
                ? "Deploy Guardrails"
                : deployState === "executing"
                  ? "Executing..."
                  : deployState === "deployed"
                    ? "Deployed"
                    : "Failed"}
            </span>
          </button>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        <Toolbox
          activeItemId={tutorialConfig.toolboxActiveId}
          tooltip={tutorialConfig.tooltip}
          completedItemIds={completedItemIds}
          onSelect={handleToolboxSelect}
        />
        <PlaybookCanvas />
      </div>

      {showWelcome && <WelcomeModal onDismiss={() => setShowWelcome(false)} />}

      {resolutionOpen && <ResolutionPanel />}

      <Toast
        visible={toastVisible}
        message="Crisis averted. Time saved: 45 minutes. Sleep preserved."
      />

      {escalationOpen && <EscalationScreen />}
    </div>
  );
}
