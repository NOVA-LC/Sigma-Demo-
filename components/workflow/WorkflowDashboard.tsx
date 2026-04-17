"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "reactflow";

import WorkflowCanvas from "./WorkflowCanvas";
import NodeLibrary from "./NodeLibrary";
import ExecutionLogs from "./ExecutionLogs";
import type { NodeKind, WorkflowNodeData } from "./WorkflowNode";

const BORDER_IDLE = "#CBD5E1";
const BORDER_PROCESSING = "#FACC15";
const BORDER_COMPLETE = "#10B981";

const STEP_DELAY_MS = 1500;

const defaultLabels: Record<NodeKind, string> = {
  Trigger: "New Trigger",
  Decision: "New Decision",
  Action: "New Action",
};

const edgeStyle = {
  animated: true,
  style: { stroke: "#94A3B8", strokeWidth: 2 },
} as const;

function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toFixed(2).padStart(5, "0")}`;
}

/**
 * Build the visit order by walking the user-built graph:
 *  - roots = nodes with no incoming edge
 *  - BFS from each root
 *  - any disconnected nodes are appended at the end so they still run
 */
function computeTraversalOrder(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): string[] {
  if (nodes.length === 0) return [];

  const incoming = new Map<string, number>();
  nodes.forEach((n) => incoming.set(n.id, 0));
  edges.forEach((e) => {
    incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1);
  });

  const adj = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  });

  const roots = nodes
    .filter((n) => (incoming.get(n.id) ?? 0) === 0)
    .map((n) => n.id);

  // If every node has an incoming edge (cycle or no obvious root), fall
  // back to whichever node was added first.
  const startingIds = roots.length > 0 ? roots : [nodes[0].id];

  const visited = new Set<string>();
  const order: string[] = [];
  const queue: string[] = [...startingIds];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    order.push(id);
    (adj.get(id) ?? []).forEach((next) => {
      if (!visited.has(next)) queue.push(next);
    });
  }

  // Include nodes that weren't reachable from any root.
  nodes.forEach((n) => {
    if (!visited.has(n.id)) order.push(n.id);
  });

  return order;
}

function WorkflowDashboardInner() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<WorkflowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge["data"]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const nodeIdRef = useRef(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearAllTimeouts(), []);

  const setNodeBorder = useCallback(
    (nodeId: string, color: string) => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, borderColor: color } }
            : n,
        ),
      );
    },
    [setNodes],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...edgeStyle }, eds));
    },
    [setEdges],
  );

  const onNodeDrop = useCallback(
    (kind: NodeKind, position: { x: number; y: number }) => {
      nodeIdRef.current += 1;
      const id = `node-${nodeIdRef.current}`;
      const newNode: Node<WorkflowNodeData> = {
        id,
        type: "workflow",
        position,
        data: {
          kind,
          label: defaultLabels[kind],
          borderColor: BORDER_IDLE,
        },
      };
      setNodes((ns) => ns.concat(newNode));
    },
    [setNodes],
  );

  const resetBorders = useCallback(() => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        data: { ...n.data, borderColor: BORDER_IDLE },
      })),
    );
  }, [setNodes]);

  const resetRun = useCallback(() => {
    clearAllTimeouts();
    resetBorders();
    setLogs([]);
    setIsRunning(false);
    setHasRun(false);
  }, [resetBorders]);

  const clearCanvas = useCallback(() => {
    clearAllTimeouts();
    setNodes([]);
    setEdges([]);
    setLogs([]);
    setIsRunning(false);
    setHasRun(false);
    nodeIdRef.current = 0;
  }, [setNodes, setEdges]);

  const runWorkflow = useCallback(() => {
    if (isRunning) return;
    if (nodes.length === 0) {
      setLogs(["[00:00.00] No nodes on canvas. Drag from the library to begin."]);
      return;
    }

    clearAllTimeouts();
    resetBorders();
    setLogs([]);
    setIsRunning(true);
    setHasRun(true);

    const order = computeTraversalOrder(nodes, edges);
    const labelById = new Map(nodes.map((n) => [n.id, n.data.label] as const));

    order.forEach((nodeId, idx) => {
      const processingAt = idx * STEP_DELAY_MS;
      const completeAt = processingAt + STEP_DELAY_MS;

      timeoutsRef.current.push(
        setTimeout(() => {
          setNodeBorder(nodeId, BORDER_PROCESSING);
          setLogs((prev) => [
            ...prev,
            `[${formatTime(processingAt)}] → Executing "${labelById.get(nodeId) ?? nodeId}"...`,
          ]);
        }, processingAt),
      );

      timeoutsRef.current.push(
        setTimeout(() => {
          setNodeBorder(nodeId, BORDER_COMPLETE);
          setLogs((prev) => [
            ...prev,
            `[${formatTime(completeAt)}] ✓ Completed "${labelById.get(nodeId) ?? nodeId}"`,
          ]);
          if (idx === order.length - 1) {
            setIsRunning(false);
            setLogs((prev) => [
              ...prev,
              `[${formatTime(completeAt)}] Workflow finished.`,
            ]);
          }
        }, completeAt),
      );
    });
  }, [edges, isRunning, nodes, resetBorders, setNodeBorder]);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-10 py-6 bg-white border-b border-slate-200">
        <h2 className="font-heading font-semibold text-2xl text-primary-navy">
          Workflow Orchestration: Self-Healing Server Restart
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearCanvas}
            disabled={isRunning || nodes.length === 0}
            className="font-heading font-semibold text-sm px-5 py-2.5 rounded-full border border-slate-300 text-primary-navy bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Clear Canvas
          </button>
          {hasRun && !isRunning && (
            <button
              type="button"
              onClick={resetRun}
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
          <NodeLibrary />
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDrop={onNodeDrop}
          />
          <ExecutionLogs logs={logs} />
        </div>
      </section>
    </div>
  );
}

export default function WorkflowDashboard() {
  return (
    <ReactFlowProvider>
      <WorkflowDashboardInner />
    </ReactFlowProvider>
  );
}
