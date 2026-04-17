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

import {
  itemsById,
  NODE_ID_BY_ITEM,
  POSITION_BY_ITEM,
  TRIGGER_NODE_ID,
  type TutorialStep,
} from "@/components/builder/toolboxItems";

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

  // Tutorial state (lives in the store so both the sidebar catalog and
  // the /builder page can read + advance it)
  tutorialStep: TutorialStep;
  completedItemIds: string[];

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  onConnect: (connection: Connection) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setIsRunning: (running: boolean) => void;
  appendLog: (line: string) => void;
  clearLogs: () => void;
  resetBorders: () => void;
  resetAll: () => void;
  setPhase: (phase: Phase) => void;

  // Tutorial actions
  setTutorialStep: (step: TutorialStep) => void;
  selectToolboxItem: (itemId: string) => void;
  resetTutorial: () => void;
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
  tutorialStep: "add-clear-cache",
  completedItemIds: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => set({ nodes: [...get().nodes, node] }),

  onConnect: (connection) =>
    set({
      edges: addEdge({ ...connection, ...defaultEdgeOptions }, get().edges),
    }),

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
        data: { ...(n.data ?? {}), borderColor: "#E2E8F0" },
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

  setTutorialStep: (step) => set({ tutorialStep: step }),

  selectToolboxItem: (itemId) => {
    const item = itemsById[itemId];
    if (!item) return;

    const nodeId = NODE_ID_BY_ITEM[itemId];
    const position = POSITION_BY_ITEM[itemId];
    if (!nodeId || !position) return;

    const state = get();
    if (state.completedItemIds.includes(itemId)) return;

    // Parent: Trigger for the first action; previous action for later ones.
    const parentId =
      itemId === "clear-gateway-cache"
        ? TRIGGER_NODE_ID
        : NODE_ID_BY_ITEM["clear-gateway-cache"];

    const newNode: Node = {
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

    const newEdge: Edge = {
      id: `edge-${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
      animated: true,
      style: { stroke: "#94A3B8", strokeWidth: 2 },
    };

    const nextStep: TutorialStep =
      itemId === "clear-gateway-cache"
        ? "add-reboot"
        : itemId === "reboot-server"
          ? "deploy"
          : state.tutorialStep;

    set({
      nodes: [...state.nodes, newNode],
      edges: [...state.edges, newEdge],
      completedItemIds: [...state.completedItemIds, itemId],
      tutorialStep: nextStep,
    });
  },

  resetTutorial: () =>
    set({
      tutorialStep: "add-clear-cache",
      completedItemIds: [],
    }),
}));
