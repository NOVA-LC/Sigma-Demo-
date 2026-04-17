"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import RemediationCatalog from "@/components/RemediationCatalog";

/* ── Minimal line icons ─────────────────────────────────────────────────── */

function RadarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-[15px] h-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <circle cx="8" cy="8" r="6.25" />
      <circle cx="8" cy="8" r="3.5" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-[15px] h-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 2.4a3 3 0 0 1 2.9 4l2.2 2.2-1.4 1.4-2.2-2.2a3 3 0 0 1-4-2.9" />
      <path d="M11.1 4.7 9.5 6.3l.8.8-1.6 1.6L3.5 14a1.2 1.2 0 1 1-1.6-1.6l5.3-5.3 1.6-1.6.8.8 1.5-1.6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-[15px] h-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="5.5" r="2.3" />
      <path d="M1.7 13.5c.4-2.3 2.2-3.7 4.3-3.7s3.9 1.4 4.3 3.7" />
      <circle cx="11.5" cy="4.5" r="1.8" />
      <path d="M14.5 11.8c-.2-1.6-1.3-2.6-2.8-2.6" />
    </svg>
  );
}

function LogsIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-[15px] h-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 2h6l3 3v8.5a.5.5 0 0 1-.5.5h-8.5a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5z" />
      <path d="M9.5 2v3h3" />
      <path d="M5.5 8.5h5M5.5 11h5M5.5 6h2.5" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-[15px] h-[15px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1M12.6 12.6l-1.1-1.1M4.5 4.5 3.4 3.4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

/* ── Pulse dot ──────────────────────────────────────────────────────────── */

type DotColor = "red" | "blue" | "emerald";

const dotClassMap: Record<DotColor, string> = {
  red: "bg-red-500",
  blue: "bg-[#0099FF]",
  emerald: "bg-emerald-500",
};

function PulseDot({ color }: { color: DotColor }) {
  const bg = dotClassMap[color];
  return (
    <span className="relative flex items-center justify-center w-2 h-2 shrink-0">
      <span
        className={`absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping ${bg}`}
      />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${bg}`} />
    </span>
  );
}

/* ── Nav data ───────────────────────────────────────────────────────────── */

type PrimaryLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

const primaryLinks: PrimaryLink[] = [
  {
    href: "/",
    label: "AI Triage Dashboard",
    icon: <RadarIcon />,
  },
  {
    href: "/builder",
    label: "Playbook Builder",
    icon: <WrenchIcon />,
  },
];

const systemLinks: { label: string; icon: ReactNode }[] = [
  { label: "Active Agents", icon: <UsersIcon /> },
  { label: "Execution Logs", icon: <LogsIcon /> },
  { label: "Settings", icon: <GearIcon /> },
];

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-[22px] pt-4 pb-1.5 text-[9px] font-heading font-semibold tracking-[0.24em] text-white/30 uppercase">
      {children}
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────── */

export default function Sidebar() {
  const pathname = usePathname();
  const isBuilder = pathname === "/builder";

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when the mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile hamburger — only below md */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className={`md:hidden fixed top-3 left-3 z-[60] w-9 h-9 rounded-md bg-primary-navy text-white flex items-center justify-center border border-white/10 shadow-lg transition-opacity ${
          mobileOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <MenuIcon />
      </button>

      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[56] bg-primary-navy text-white flex flex-col
          w-[86vw] max-w-[320px] sm:w-72
          md:translate-x-0 md:w-60 lg:w-64 xl:w-72 2xl:w-80
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Brand + mobile close */}
        <div className="px-5 py-5 border-b border-white/5 shrink-0 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 shrink-0 rounded-md bg-gradient-to-br from-[#33ADFF] to-[#0077CC] flex items-center justify-center text-white font-heading font-bold text-sm shadow-[0_2px_8px_rgba(0,153,255,0.35)]">
              σ
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-bold text-[14px] tracking-[0.08em] text-white leading-tight truncate">
                SIGMA AUTOMATE
              </h1>
              <p className="text-[9px] text-white/40 tracking-[0.22em] uppercase mt-0.5 truncate">
                Autonomous Operations
              </p>
            </div>
          </div>

          {/* Mobile-only close button */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="md:hidden w-8 h-8 shrink-0 rounded-md text-white/70 hover:text-white hover:bg-white/5 flex items-center justify-center"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <SectionLabel>Views</SectionLabel>
          <ul>
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-3 pl-[22px] pr-5 py-2.5 text-[13px] font-heading font-medium border-l-2 transition-colors ${
                      isActive
                        ? "border-[#0099FF] bg-white/[0.03] text-white"
                        : "border-transparent text-slate-400 hover:bg-white/[0.02] hover:text-white"
                    }`}
                  >
                    <span
                      className={
                        isActive
                          ? "text-[#0099FF]"
                          : "text-slate-500 group-hover:text-slate-300 transition-colors"
                      }
                    >
                      {link.icon}
                    </span>
                    <span className="flex-1 truncate">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {isBuilder && (
            <>
              <SectionLabel>Remediation Catalog</SectionLabel>
              <RemediationCatalog />
            </>
          )}

          <SectionLabel>System</SectionLabel>
          <ul>
            {systemLinks.map((link) => (
              <li key={link.label}>
                <div
                  className="flex items-center gap-3 pl-[22px] pr-5 py-2 text-[13px] font-heading font-medium border-l-2 border-transparent text-slate-500/80 cursor-not-allowed select-none"
                  aria-disabled
                  title="Coming soon"
                >
                  <span className="text-slate-600">{link.icon}</span>
                  <span className="flex-1 truncate">{link.label}</span>
                </div>
              </li>
            ))}
          </ul>

          {isBuilder && (
            <div className="mt-auto px-4 pt-5 pb-4">
              <div className="rounded-lg bg-accent-blue/10 border border-accent-blue/20 p-3.5 text-[13px] text-white/85 leading-relaxed">
                <div className="font-heading font-semibold text-white mb-1.5">
                  💡 How this works:
                </div>
                <p>
                  Order matters. Put your easiest fix first. I will run Step 1
                  and check if the gateway is back online. If it works, I stop.
                  If it fails, I automatically move to Step 2.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <PulseDot color="emerald" />
            <span className="text-[10px] text-white/55 tracking-wide font-heading font-medium truncate">
              SIGMA Online &amp; Monitoring
            </span>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/5 text-[10px] text-white/30 tracking-wide shrink-0">
          v0.1.0 — Demo Build
        </div>
      </aside>
    </>
  );
}
