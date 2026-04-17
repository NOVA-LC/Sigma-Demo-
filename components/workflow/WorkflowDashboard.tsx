"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Edge, Node } from "reactflow";

import WorkflowCanvas from "./WorkflowCanvas";
import ExecutionLogs from "./ExecutionLogs";
import type { WorkflowNodeData } from "./WorkflowNode";

const BORDER_IDLE = "#CBD5E1";
const BORDER_PROCESSING = "#FACC15"; // yellow-400
const BORDER_COMPLETE = "#10B981"; // emerald-500

const baseNodes: Node<WorkflowNodeData>[] = [
  {
    id: "1",
    type: "workflow",
    position: { x: 0, y: 0 },
    data: {
      kind: "Trigger",
      label: "Alert: CPU > 90% Detected",
      borderColor: BORDER_IDLE,
    },
    draggable: false,
    selectable: false,
  },
  {
    id: "2",
    type: "workflow",
    position: { x: 0, y: 140 },
    data: {
      kind: "Decision",
      label: "Compute Module: Route to Agent",
      borderColor: BORDER_IDLE,
    },
    draggable: false,
    selectable: false,
  },
  {
    id: "3",
    type: "workflow",
    position: { x: 0, y: 280 },
    data: {
      kind: "Action",
      label: "Self-Healing: Execute Service Restart",
      borderColor: BORDER_IDLE,
    },
    draggable: false,
    selectable: false,
  },
  {
    id: "4",
    type: "workflow",
    position: { x: 0, y: 420 },
    data: {
      kind: "Verify",
      label: "Verify: Confirm Server Health",
      borderColor: BORDER_IDLE,
    },
    draggable: false,
    selectable: false,
  },
];

const baseEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#94A3B8", strokeWidth: 2 } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#94A3B8", strokeWidth: 2 } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "#94A3B8", strokeWidth: 2 } },
];

const steps: { nodeId: string; log: string }[] = [
  { nodeId: "1", log: "[00:00.00] System drift detected. Triggering self-healing workflow..." },
  { nodeId: "2", log: "[00:01.50] Reasoning engine engaged. Routing to Remediation Agent..." },
  { nodeId: "3", log: "[00:03.00] Execution layer active. Restarting isolated services..." },
  { nodeId: "4", log: "[00:04.50] Resolution verified. Incident closed without human intervention." },
];

const STEP_DELAY_MS = 1500;

export default function WorkflowDashboard() {
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>(baseNodes);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const setNodeBorder = useCallback((nodeId: string, color: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, borderColor: color } }
          : n,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    clearAllTimeouts();
    setNodes(baseNodes.map((n) => ({ ...n, data: { ...n.data, borderColor: BORDER_IDLE } })));
    setLogs([]);
    setIsRunning(false);
    setHasRun(false);
  }, []);

  const runWorkflow = useCallback(() => {
    if (isRunning) return;
    clearAllTimeouts();
    setNodes(baseNodes.map((n) => ({ ...n, data: { ...n.data, borderColor: BORDER_IDLE } })));
    setLogs([]);
    setIsRunning(true);
    setHasRun(true);

    steps.forEach((step, idx) => {
      const processingAt = idx * STEP_DELAY_MS;
      const completeAt = processingAt + STEP_DELAY_MS;

      // Node enters processing state (yellow)
      timeoutsRef.current.push(
        setTimeout(() => {
          setNodeBorder(step.nodeId, BORDER_PROCESSING);
        }, processingAt),
      );

      // Node completes (green) + append log
      timeoutsRef.current.push(
        setTimeout(() => {
          setNodeBorder(step.nodeId, BORDER_COMPLETE);
          setLogs((prev) => [...prev, step.log]);
          if (idx === steps.length - 1) {
            setIsRunning(false);
          }
        }, completeAt),
      );
    });
  }, [isRunning, setNodeBorder]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-10 py-6 bg-white border-b border-slate-200">
        <h2 className="font-heading font-semibold text-2xl text-primary-navy">
          Workflow Orchestration: Self-Healing Server Restart
        </h2>
        <div className="flex items-center gap-3">
          {hasRun && !isRunning && (
            <button
              type="button"
              onClick={reset}
              className="font-heading font-semibold text-sm px-5 py-2.5 rounded-full border border-slate-300 text-primary-navy bg-white hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={runWorkflow}
            disabled={isRunning}
            className="bg-accent-blue hover:bg-[#007ACC] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-heading font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shadow-sm"
          >
            {isRunning ? "Running…" : "Run Workflow"}
          </button>
        </div>
      </header>

      <section className="px-10 py-8">
        <div className="flex gap-6 items-start">
          <WorkflowCanvas nodes={nodes} edges={baseEdges} />
          <ExecutionLogs logs={logs} />
        </div>
      </section>
    </div>
  );
}
