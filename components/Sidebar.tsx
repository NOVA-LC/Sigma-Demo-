"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "AI Triage Dashboard", href: "/" },
  { label: "Playbook Builder", href: "/builder" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-primary-navy text-white flex flex-col">
      <div className="px-6 py-6 border-b border-secondary-dark">
        <h1 className="font-heading font-bold text-xl tracking-wide">
          SIGMA AUTOMATE
        </h1>
        <p className="text-[11px] text-light-gray/70 mt-1 tracking-wider uppercase">
          Autonomous Operations
        </p>
      </div>

      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary-dark text-white"
                      : "text-light-gray hover:bg-secondary-dark hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-6 py-4 border-t border-secondary-dark text-[11px] text-light-gray/60">
        v0.1.0 — Demo Build
      </div>
    </aside>
  );
}
