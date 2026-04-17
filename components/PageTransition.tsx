"use client";

import { usePathname } from "next/navigation";

/**
 * Re-keys its children on route change so a CSS fade-in animation
 * replays whenever the user navigates between pages.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
