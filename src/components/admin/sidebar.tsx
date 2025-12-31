"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navBase =
  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md";

const icons = {
  dashboard: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  registrations: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  contacts: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  ),
  articles: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
  profile: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  admins: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const items: Array<{ href: string; label: string; icon: keyof typeof icons; superadminOnly?: boolean }> = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/registrations", label: "Registrations", icon: "registrations" },
    { href: "/contacts", label: "Contacts", icon: "contacts" },
    { href: "/articles", label: "Articles", icon: "articles" },
    { href: "/admins", label: "Manage Admins", icon: "admins", superadminOnly: true },
  ];

  return (
    <aside
      className="flex h-full w-72 flex-col border-r border-white/10 shadow-2xl md:h-screen md:sticky md:top-0"
      style={{ background: "var(--da-sidebar-bg)" }}
    >
      {/* Header */}
      <div className="border-b border-white/10 bg-white/10 px-6 py-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-white">Darul Abror</div>
            <div className="text-xs text-white/70">Admin Panel</div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
          <div className="text-xs font-medium text-white/60">Role</div>
          <div className="text-sm font-semibold text-white">{role ?? "-"}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">
          {items
            .filter((it) => (it.superadminOnly ? role === "superadmin" : true))
            .map((it) => {
              const active =
                pathname === it.href || (pathname?.startsWith(it.href + "/") ?? false);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onNavigate}
                  className={cn(
                    navBase,
                    active
                      ? "bg-white/95 text-[var(--da-primary)] shadow-lg"
                      : "text-white/90 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span className={cn("transition-transform duration-200", active && "scale-110")}>
                    {icons[it.icon]}
                  </span>
                  <span className="flex-1">{it.label}</span>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-[var(--da-primary)] animate-pulse" />
                  )}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
        <div className="text-xs text-white/50 text-center">
          © 2025 Darul Abror
        </div>
      </div>
    </aside>
  );
}
