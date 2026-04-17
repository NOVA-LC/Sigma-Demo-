import { Handle, Position, NodeProps } from "reactflow";

export type WorkflowNodeData = {
  label: string;
  kind: "Trigger" | "Decision" | "Action" | "Verify";
  borderColor?: string;
};

const kindLabels: Record<WorkflowNodeData["kind"], string> = {
  Trigger: "TRIGGER",
  Decision: "DECISION",
  Action: "ACTION",
  Verify: "VERIFY",
};

export default function WorkflowNode({ data }: NodeProps<WorkflowNodeData>) {
  const borderColor = data.borderColor ?? "#CBD5E1";

  return (
    <div
      className="bg-white rounded-xl shadow-md px-5 py-4 w-64"
      style={{ border: `2px solid ${borderColor}` }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        className="!bg-slate-300 !w-2 !h-2 !border-0"
      />

      <div className="text-[10px] font-heading font-semibold tracking-[0.12em] text-slate-400 mb-1.5">
        {kindLabels[data.kind]}
      </div>
      <div className="font-heading font-semibold text-sm text-primary-navy leading-snug">
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="!bg-slate-300 !w-2 !h-2 !border-0"
      />
    </div>
  );
}
