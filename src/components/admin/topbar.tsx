"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";

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
  const { theme, toggleTheme } = useTheme();
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
            className="md:hidden h-9 px-3 rounded-xl bg-[var(--da-chrome-btn-bg)] text-[var(--da-on-chrome)] border border-[var(--da-chrome-btn-border)] hover:bg-[var(--da-chrome-btn-hover-bg)] backdrop-blur-sm transition-colors"
            onClick={onOpenSidebar}
            aria-label="Buka menu"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <div className="text-lg font-bold text-[var(--da-on-chrome)] drop-shadow-md">{title}</div>
            <div className="text-xs text-[var(--da-chrome-muted)]">Kelola data dengan mudah</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              // close user menu if open
              setOpen(false);
              toggleTheme();
            }}
            aria-label={theme === "dark" ? "Ganti ke tema siang" : "Ganti ke tema malam"}
            className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-[var(--da-chrome-btn-bg)] border border-[var(--da-chrome-btn-border)] hover:bg-[var(--da-chrome-btn-hover-bg)] backdrop-blur-sm transition-colors text-[var(--da-on-chrome)]"
          >
            {theme === "dark" ? (
              // Sun
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314L7.05 7.05m9.9 9.9 1.414 1.414M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                />
              </svg>
            ) : (
              // Moon
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12.8A8.5 8.5 0 0 1 11.2 3a6.9 6.9 0 1 0 9.8 9.8Z"
                />
              </svg>
            )}
          </button>

          <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="User menu"
            className="h-9 px-3 rounded-xl bg-[var(--da-chrome-btn-bg)] border border-[var(--da-chrome-btn-border)] hover:bg-[var(--da-chrome-btn-hover-bg)] backdrop-blur-sm transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[var(--da-chrome-avatar-bg)] backdrop-blur-sm flex items-center justify-center text-[var(--da-on-chrome)] text-xs font-bold border border-[var(--da-chrome-avatar-border)]">
                {(admin?.username ?? admin?.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[var(--da-on-chrome)]">{admin?.username ?? admin?.email ?? "User"}</div>
                <div className="text-[10px] text-[var(--da-chrome-muted)]">{role ?? "-"}</div>
              </div>
            </div>
          </button>

          {open ? (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--da-glass-border)] bg-[var(--da-glass-bg-strong)] shadow-[var(--da-glass-shadow)] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-[var(--da-glass-border)]">
                <div className="text-sm font-semibold text-[var(--da-on-chrome)]">{admin?.username ?? admin?.email}</div>
                <div className="text-xs text-[var(--da-chrome-muted)] mt-0.5">{admin?.email}</div>
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
      </div>
    </header>
  );
}
