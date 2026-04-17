import { Handle, Position, NodeProps } from "reactflow";

export type NodeKind = "Trigger" | "Action";

export type WorkflowNodeData = {
  label: string;
  kind: NodeKind;
  accentColor: string; // pill color
  borderColor?: string; // dynamic
  success?: boolean; // shown after successful execution
  failed?: boolean; // shown after failed execution
};

export default function WorkflowNode({ data }: NodeProps<WorkflowNodeData>) {
  const borderColor = data.borderColor ?? "#CBD5E1";
  const isTrigger = data.kind === "Trigger";

  return (
    <div
      className="bg-white rounded-xl shadow-md px-5 py-4 w-64"
      style={{ border: `2px solid ${borderColor}` }}
    >
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-400 !w-2.5 !h-2.5 !border-0"
        />
      )}

      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="inline-block text-[10px] font-heading font-semibold tracking-[0.14em] text-white uppercase rounded-full px-2 py-0.5"
          style={{ backgroundColor: data.accentColor }}
        >
          {data.kind}
        </span>
        {data.success && (
          <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold tracking-[0.14em] text-white uppercase rounded-full bg-emerald-500 px-2 py-0.5 animate-page-in">
            <span>✓</span> Success
          </span>
        )}
        {data.failed && (
          <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold tracking-[0.14em] text-white uppercase rounded-full bg-red-500 px-2 py-0.5 animate-page-in">
            <span>✕</span> Failed
          </span>
        )}
      </div>
      <div className="font-heading font-semibold text-sm text-primary-navy leading-snug">
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400 !w-2.5 !h-2.5 !border-0"
      />
    </div>
  );
}
