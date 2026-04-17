"use client";

import type { ReactNode } from "react";

import SimulationToggle from "./SimulationToggle";
import StatusBreadcrumbs from "./StatusBreadcrumbs";

type Props = {
  children?: ReactNode; // right-side slot for the secondary action row
  toggleDisabled?: boolean;
};

/**
 * Global header for the demo.
 *
 * Top strip (full-width, thin): status breadcrumbs (left) + simulation toggle
 * (right). Optional second row renders via `children` for page-local title and
 * action buttons (e.g. the Deploy Guardrails button on /builder).
 */
export default function BuilderHeader({ children, toggleDisabled }: Props) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-8 py-2.5 border-b border-slate-100 flex items-center justify-between gap-6">
        <StatusBreadcrumbs />
        <SimulationToggle disabled={toggleDisabled} />
      </div>

      {children && <div className="px-8 py-4">{children}</div>}
    </header>
  );
}
