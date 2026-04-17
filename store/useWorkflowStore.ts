import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "reactflow";

export type Phase =
  | "watching"
  | "investigating"
  | "waiting-for-permission"
  | "executing"
  | "resolved";

type WorkflowState = {
  // React Flow state
  nodes: Node[];
  edges: Edge[];

  // Execution state
  isRunning: boolean;
  logs: string[];

  // Global header state
  phase: Phase;
  isFailureSimulated: boolean;

  // Actions required by spec
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  onConnect: (connection: Connection) => void;

  // Reactflow change handlers (needed so nodes are draggable /
  // edges are removable through the Reactflow UI)
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  // Execution helpers
  setIsRunning: (running: boolean) => void;
  appendLog: (line: string) => void;
  clearLogs: () => void;
  resetBorders: () => void;
  resetAll: () => void;

  // Header state setters
  setPhase: (phase: Phase) => void;
  setIsFailureSimulated: (value: boolean) => void;
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "#94A3B8", strokeWidth: 2 },
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  isRunning: false,
  logs: [],
  phase: "waiting-for-permission",
  isFailureSimulated: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, ...defaultEdgeOptions }, get().edges) }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  setIsRunning: (running) => set({ isRunning: running }),

  appendLog: (line) => set({ logs: [...get().logs, line] }),

  clearLogs: () => set({ logs: [] }),

  resetBorders: () =>
    set({
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...(n.data ?? {}), borderColor: "#CBD5E1" },
      })),
    }),

  resetAll: () =>
    set({
      nodes: [],
      edges: [],
      logs: [],
      isRunning: false,
    }),

  setPhase: (phase) => set({ phase }),
  setIsFailureSimulated: (isFailureSimulated) => set({ isFailureSimulated }),
}));
