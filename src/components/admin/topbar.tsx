"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

function getTitle(pathname: string | null) {
  const p = pathname ?? "";
  if (p.startsWith("/registrations")) return "Registrations";
  if (p.startsWith("/contacts")) return "Contacts";
  if (p.startsWith("/articles")) return "Articles";
  if (p.startsWith("/profile")) return "Profile";
  if (p.startsWith("/admins")) return "Manage Admins";
  return "Dashboard";
}

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const { admin, role, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--da-border)] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={onOpenSidebar}
            aria-label="Buka menu"
          >
            Menu
          </Button>
          <div className="text-sm font-semibold text-[var(--da-text-primary)]">{title}</div>
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="User menu"
          >
            {admin?.username ?? admin?.email ?? "User"} ({role ?? "-"})
          </Button>

          {open ? (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-[var(--da-border)] bg-white p-2 shadow-[var(--da-card-shadow)]">
              <button
                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
