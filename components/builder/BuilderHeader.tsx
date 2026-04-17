"use client";

import type { ReactNode } from "react";

import StatusBreadcrumbs from "./StatusBreadcrumbs";

type Props = {
  children?: ReactNode; // right-side slot for the secondary action row
};

/**
 * Global header for the demo.
 *
 * Top strip (full-width, thin): status breadcrumbs showing where we are in
 * the autonomous incident response flow. Optional second row renders via
 * `children` for the page title and action buttons (e.g. the Execute
 * Playbook button on /builder).
 */
export default function BuilderHeader({ children }: Props) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-8 py-2.5 border-b border-slate-100">
        <StatusBreadcrumbs />
      </div>

      {children && <div className="px-8 py-4">{children}</div>}
    </header>
  );
}
