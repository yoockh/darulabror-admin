"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { useAuth } from "@/contexts/auth-context";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { token, isReady } = useAuth();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isReady) return;
    if (!token) router.replace("/login");
  }, [isReady, token, router]);

  if (!token) {
    return <div className="min-h-screen bg-[var(--da-bg)]" />;
  }

  return (
    <div className="min-h-screen bg-[var(--da-bg)]">
      <Topbar onOpenSidebar={() => setDrawerOpen(true)} />

      <div className="mx-auto flex max-w-6xl">
        <div className="hidden h-[calc(100vh-53px)] md:block">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 p-6">{children}</main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-30 md:hidden">
          <button
            className="absolute inset-0 bg-black/40"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative h-full w-72 bg-white shadow-[var(--da-hover-shadow)]">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
