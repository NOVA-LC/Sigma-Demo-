import { Handle, Position, NodeProps } from "reactflow";

export type NodeKind = "Trigger" | "Action";

export type WorkflowNodeData = {
  label: string;
  kind: NodeKind;
  accentColor: string; // retained for back-compat; no longer drives the badge
  borderColor?: string; // dynamic execution-state color
  success?: boolean;
  failed?: boolean;
};

/**
 * Muted pastel badge variants — matches the Vercel/Linear palette.
 */
const kindBadgeClasses: Record<NodeKind, string> = {
  Trigger:
    "bg-red-50 text-red-600 border border-red-100",
  Action:
    "bg-slate-50 text-slate-600 border border-slate-200",
};

export default function WorkflowNode({ data }: NodeProps<WorkflowNodeData>) {
  const borderColor = data.borderColor ?? "#E2E8F0"; // slate-200
  const isTrigger = data.kind === "Trigger";

  return (
    <div
      className="bg-white rounded-xl shadow-sm px-5 py-3.5 w-60"
      style={{ border: `1.5px solid ${borderColor}` }}
    >
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-300 !w-2 !h-2 !border-0"
        />
      )}

      <div className="flex items-center gap-1.5 mb-2">
        <span
          className={`inline-block text-[10px] font-heading font-semibold tracking-[0.12em] uppercase rounded-full px-2 py-0.5 ${kindBadgeClasses[data.kind]}`}
        >
          {data.kind}
        </span>
        {data.success && (
          <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold tracking-[0.12em] uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 animate-page-in">
            <span>✓</span> Success
          </span>
        )}
        {data.failed && (
          <span className="inline-flex items-center gap-1 text-[10px] font-heading font-semibold tracking-[0.12em] uppercase rounded-full bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 animate-page-in">
            <span>✕</span> Failed
          </span>
        )}
      </div>
      <div className="font-heading font-semibold text-[13.5px] text-slate-900 leading-snug">
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-300 !w-2 !h-2 !border-0"
      />
    </div>
  );
}
