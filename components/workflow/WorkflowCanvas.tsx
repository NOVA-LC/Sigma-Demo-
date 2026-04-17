"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

import WorkflowNode, { WorkflowNodeData } from "./WorkflowNode";

type Props = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
};

export default function WorkflowCanvas({ nodes, edges }: Props) {
  const nodeTypes = useMemo(() => ({ workflow: WorkflowNode }), []);

  return (
    <div className="flex-1 h-[620px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E2E8F0" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
