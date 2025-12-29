"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <header
      className="sticky top-0 z-40 border-b border-white/10 shadow-lg"
      style={{ background: "var(--da-header-bg)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden h-9 px-3 rounded-xl bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm transition-colors"
            onClick={onOpenSidebar}
            aria-label="Buka menu"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <div className="text-lg font-bold text-[var(--da-on-chrome)] drop-shadow-md">{title}</div>
            <div className="text-xs text-white/70">Kelola data dengan mudah</div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="User menu"
            className="h-9 px-3 rounded-xl bg-white/20 border border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold border border-white/40">
                {(admin?.username ?? admin?.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">{admin?.username ?? admin?.email ?? "User"}</div>
                <div className="text-[10px] text-white/70">{role ?? "-"}</div>
              </div>
            </div>
          </button>

          {open ? (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--da-glass-border)] bg-[var(--da-glass-bg-strong)] shadow-[var(--da-glass-shadow)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[var(--da-glass-border)]">
                <div className="text-sm font-semibold text-[var(--da-on-chrome)]">{admin?.username ?? admin?.email}</div>
                <div className="text-xs text-white/70 mt-0.5">{admin?.email}</div>
              </div>
              <div className="p-2">
                <Link
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[var(--da-on-chrome)] hover:bg-white/5 transition-colors"
                  href="/profile"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
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
