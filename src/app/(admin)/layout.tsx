"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[var(--da-bg)] p-6">
        <div className="mx-auto w-full max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Memuat sesi...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--da-bg)] p-6">
        <div className="mx-auto w-full max-w-xl">
          <Card>
            <CardHeader>
              <CardTitle>Silakan Login</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--da-text-secondary)]">
                Sesi Anda belum aktif atau sudah berakhir.
              </p>
              <div className="pt-4">
                <Button asChild className="w-full" variant="primary">
                  <Link href="/login">Ke Halaman Login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--da-bg)]">
      <Topbar onOpenSidebar={() => setDrawerOpen(true)} />

      <div className="md:grid md:grid-cols-[18rem_1fr]">
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>
        <main className="min-w-0 p-6">{children}</main>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative h-full w-72 shadow-2xl animate-in slide-in-from-left duration-300">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
