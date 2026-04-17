"use client";

import { useMemo, type ReactNode } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowStore } from "@/store/useWorkflowStore";
import WorkflowNode from "./WorkflowNode";

type Props = {
  children?: ReactNode; // overlay slot (e.g. memorization banner)
};

function PlaybookCanvasInner({ children }: Props) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const nodeTypes = useMemo(() => ({ workflow: WorkflowNode }), []);

  return (
    <div className="flex-1 w-full h-full bg-light-gray relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        // Pure static visualizer — no drag, no pan, no zoom, no selection.
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        panOnScroll={false}
        preventScrolling={false}
        fitView
        fitViewOptions={{ padding: 0.5, minZoom: 0.5, maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          color="#94A3B8"
        />
      </ReactFlow>
      {children}
    </div>
  );
}

export default function PlaybookCanvas({ children }: Props) {
  return (
    <ReactFlowProvider>
      <PlaybookCanvasInner>{children}</PlaybookCanvasInner>
    </ReactFlowProvider>
  );
}
