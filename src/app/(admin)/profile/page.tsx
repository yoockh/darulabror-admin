"use client";

import * as React from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { patchMyPassword } from "@/lib/api/endpoints";
import { formatDateTime } from "@/lib/format";

export default function ProfilePage() {
  const { admin, role, isReady, refreshProfile, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isReady) return;
    if (!admin) void refreshProfile();
  }, [isReady, admin, refreshProfile]);

  if (!isReady) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Profile</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">Informasi akun & keamanan.</p>
        </div>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent>
            {!admin ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-28" />
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[var(--da-text-secondary)]">Username:</span>{" "}
                  <span className="text-[var(--da-text-primary)]">{admin.username}</span>
                </div>
                <div>
                  <span className="text-[var(--da-text-secondary)]">Email:</span>{" "}
                  <span className="text-[var(--da-text-primary)]">{admin.email}</span>
                </div>
                <div>
                  <span className="text-[var(--da-text-secondary)]">Role:</span>{" "}
                  <span className="text-[var(--da-text-primary)]">{role ?? admin.role}</span>
                </div>
                <div>
                  <span className="text-[var(--da-text-secondary)]">Created:</span>{" "}
                  <span className="text-[var(--da-text-primary)]">
                    {formatDateTime(admin.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--da-text-secondary)]">Updated:</span>{" "}
                  <span className="text-[var(--da-text-primary)]">
                    {formatDateTime(admin.updated_at)}
                  </span>
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => void refreshProfile()}>
                    Refresh
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ganti Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!currentPassword || !newPassword || !confirmPassword) {
                  toast.error("Semua field wajib diisi.");
                  return;
                }
                if (newPassword !== confirmPassword) {
                  toast.error("Konfirmasi password tidak sama.");
                  return;
                }
                setSaving(true);
                try {
                  await patchMyPassword(currentPassword, newPassword);
                  toast.success("Password berhasil diubah. Silakan login ulang.");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  logout();
                } catch (err: any) {
                  toast.error(err?.message ?? "Gagal mengubah password.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              <div className="space-y-1">
                <label className="text-sm font-medium">Password Saat Ini</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password Baru</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
