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
        // Top-left anchored viewport → flow coords map 1:1 to pixels, so the
        // Trigger at (250, 50) lands exactly 50px from the top of the canvas.
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
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

      {/* PLAYBOOK ORIGIN label — sits just above the Trigger node.
          Node width is 240px; position.x=250; mid-point = 370px. */}
      <div
        aria-hidden
        className="pointer-events-none absolute font-heading font-semibold text-[9px] tracking-[0.28em] text-primary-navy/35 uppercase"
        style={{ top: 28, left: 250, width: 240, textAlign: "center" }}
      >
        Playbook Origin
      </div>

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
