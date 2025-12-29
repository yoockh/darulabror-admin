"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navBase =
  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--da-text-primary)] transition-colors hover:bg-[var(--da-bg)]";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const items: Array<{ href: string; label: string; superadminOnly?: boolean }> = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/registrations", label: "Registrations" },
    { href: "/contacts", label: "Contacts" },
    { href: "/articles", label: "Articles" },
    { href: "/profile", label: "Profile" },
    { href: "/admins", label: "Manage Admins", superadminOnly: true },
  ];

  return (
    <aside className="h-full w-64 flex-col border-r border-[var(--da-border)] bg-white">
      <div className="px-5 py-4">
        <div className="text-sm font-semibold text-[var(--da-green)]">Darul Abror Admin</div>
        <div className="mt-1 text-xs text-[var(--da-text-secondary)]">Role: {role ?? "-"}</div>
      </div>

      <nav className="px-3">
        <div className="space-y-1">
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
                    active &&
                      "bg-[var(--da-bg)] text-[var(--da-green)] ring-1 ring-[var(--da-green)]/20",
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
        </div>
      </nav>
    </aside>
  );
}
