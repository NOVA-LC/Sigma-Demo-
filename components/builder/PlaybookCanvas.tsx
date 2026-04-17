"use client";

import { useMemo, type ReactNode } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
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
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const nodeTypes = useMemo(() => ({ workflow: WorkflowNode }), []);

  return (
    <div className="flex-1 bg-light-gray relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        proOptions={{ hideAttribution: true }}
        deleteKeyCode={null}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1.2}
          color="#94A3B8"
        />
        <Controls showInteractive={false} />
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
