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
    <header className="sticky top-0 z-40 border-b border-[var(--da-glass-border)] bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between gap-3 px-6 py-4 md:ml-72">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="md:hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600"
            onClick={onOpenSidebar}
            aria-label="Buka menu"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <div>
            <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{title}</div>
            <div className="text-xs text-[var(--da-text-secondary)]">Kelola data dengan mudah</div>
          </div>
        </div>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-label="User menu"
            className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {(admin?.username ?? admin?.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[var(--da-text-primary)]">{admin?.username ?? admin?.email ?? "User"}</div>
                <div className="text-[10px] text-[var(--da-text-secondary)]">{role ?? "-"}</div>
              </div>
            </div>
          </Button>

          {open ? (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--da-glass-border)] bg-white shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-gray-100">
                <div className="text-sm font-semibold text-[var(--da-text-primary)]">{admin?.username ?? admin?.email}</div>
                <div className="text-xs text-[var(--da-text-secondary)] mt-0.5">{admin?.email}</div>
              </div>
              <div className="p-2">
                <button
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
