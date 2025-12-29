"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/session";

const navBase =
  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-[var(--da-text-primary)] transition-colors hover:bg-[var(--da-bg)]";

export function SidebarClient({ role }: { role: Role }) {
  const pathname = usePathname();

  const items: Array<{ href: string; label: string; superadminOnly?: boolean }> = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/registrations", label: "Registrations" },
    { href: "/contacts", label: "Contacts" },
    { href: "/articles", label: "Articles" },
    { href: "/profile", label: "Profile" },
    { href: "/manage-admins", label: "Manage Admins", superadminOnly: true },
  ];

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-[var(--da-border)] bg-white md:flex">
      <div className="px-5 py-4">
        <div className="text-sm font-semibold text-[var(--da-green)]">
          Darul Abror Admin
        </div>
        <div className="mt-1 text-xs text-[var(--da-text-secondary)]">
          Role: {role}
        </div>
      </div>

      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {items
            .filter((it) => (it.superadminOnly ? role === "superadmin" : true))
            .map((it) => {
              const active = pathname === it.href || pathname?.startsWith(it.href + "/");
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(navBase, active && "bg-[var(--da-bg)]")}
                >
                  {it.label}
                </Link>
              );
            })}
        </div>
      </nav>

      <div className="border-t border-[var(--da-border)] p-3">
        <form action="/logout" method="post">
          <button
            className={cn(navBase, "w-full justify-start text-red-600 hover:bg-red-50")}
            type="submit"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
