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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.1 4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 6.1A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.1 0 2.2-.2 3.1-.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const { admin, role, isReady, refreshProfile, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);

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
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showCurrent ? "Sembunyikan password" : "Lihat password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--da-text-secondary)] hover:text-[var(--da-text-primary)]"
                    onClick={() => setShowCurrent((v) => !v)}
                  >
                    {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password Baru</label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    aria-label={showNew ? "Sembunyikan password" : "Lihat password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--da-text-secondary)] hover:text-[var(--da-text-primary)]"
                    onClick={() => setShowNew((v) => !v)}
                  >
                    {showNew ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
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
