"use client";

import { useCallback, useMemo, useRef } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import WorkflowNode, { NodeKind, WorkflowNodeData } from "./WorkflowNode";

type Props = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onNodeDrop: (kind: NodeKind, position: { x: number; y: number }) => void;
};

export default function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeDrop,
}: Props) {
  const nodeTypes = useMemo(() => ({ workflow: WorkflowNode }), []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData(
        "application/reactflow",
      ) as NodeKind;
      if (!kind) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      onNodeDrop(kind, position);
    },
    [onNodeDrop, screenToFlowPosition],
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection);
    },
    [onConnect],
  );

  return (
    <div
      ref={wrapperRef}
      className="flex-1 h-[620px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodesDraggable
        nodesConnectable
        elementsSelectable
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#E2E8F0"
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
