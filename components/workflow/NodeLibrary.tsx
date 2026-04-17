"use client";

import type { NodeKind } from "./WorkflowNode";

const items: { kind: NodeKind; description: string }[] = [
  { kind: "Trigger", description: "Fires when an event occurs" },
  { kind: "Decision", description: "Routes based on a condition" },
  { kind: "Action", description: "Executes an operation" },
];

export default function NodeLibrary() {
  const onDragStart = (event: React.DragEvent, kind: NodeKind) => {
    event.dataTransfer.setData("application/reactflow", kind);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-60 shrink-0 h-[620px] rounded-xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
      <div className="font-heading font-semibold text-xs tracking-[0.12em] text-slate-500 uppercase mb-3">
        Node Library
      </div>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.kind}
            draggable
            onDragStart={(e) => onDragStart(e, item.kind)}
            className="cursor-grab active:cursor-grabbing select-none rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-accent-blue hover:bg-accent-blue/5 transition-colors px-3 py-3"
          >
            <div className="text-[10px] font-heading font-semibold tracking-[0.12em] text-slate-400 mb-0.5">
              {item.kind.toUpperCase()}
            </div>
            <div className="font-heading font-semibold text-sm text-primary-navy">
              {item.kind}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 leading-snug">
              {item.description}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-auto pt-4 text-[11px] text-slate-400 leading-snug">
        Drag a node onto the canvas, then connect handles to wire the flow.
      </p>
    </aside>
  );
}
