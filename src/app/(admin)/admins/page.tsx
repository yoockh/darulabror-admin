"use client";

import * as React from "react";
import { toast } from "sonner";
import { AccessDenied } from "@/components/admin/access-denied";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TBody, THead, TR, TH, TD, TableEmptyState } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { createAdmin, deleteAdmin, listAdmins, updateAdmin } from "@/lib/api/endpoints";
import { formatDateTime } from "@/lib/format";
import type { AdminDTO, Role } from "@/lib/types";

function unwrapArray<T>(input: any): T[] {
  if (Array.isArray(input)) return input;
  if (Array.isArray(input?.items)) return input.items;
  if (Array.isArray(input?.data)) return input.data;
  return [];
}

function roleBadgeVariant(role?: string) {
  if (role === "superadmin") return "success";
  return "default";
}

type AdminFormState = {
  username: string;
  email: string;
  role: Role;
  password: string;
  is_active: boolean;
};

function defaultForm(): AdminFormState {
  return {
    username: "",
    email: "",
    role: "admin",
    password: "",
    is_active: true,
  };
}

export default function AdminsPage() {
  const { role, isReady } = useAuth();

  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<AdminDTO[]>([]);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [selected, setSelected] = React.useState<AdminDTO | null>(null);
  const [form, setForm] = React.useState<AdminFormState>(defaultForm());

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAdmins();
      setRows(unwrapArray<AdminDTO>(res));
    } catch (e: any) {
      toast.error(e?.message ?? "Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isReady) return;
    if (role !== "superadmin") return;
    void refresh();
  }, [isReady, role, refresh]);

  if (!isReady || role === null) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Manage Admins</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">Hanya superadmin.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setForm(defaultForm());
            setCreateOpen(true);
          }}
        >
          Buat Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Username</TH>
                  <TH>Email</TH>
                  <TH>Role</TH>
                  <TH>Status</TH>
                  <TH>Created</TH>
                  <TH>Action</TH>
                </TR>
              </THead>
              <TBody>
                {rows.length === 0 ? (
                  <TableEmptyState colSpan={6} title="Belum ada admin" />
                ) : (
                  rows.map((a) => (
                    <TR key={String(a.id)}>
                      <TD>{a.username}</TD>
                      <TD>{a.email}</TD>
                      <TD>
                        <Badge variant={roleBadgeVariant(a.role) as any}>{a.role}</Badge>
                      </TD>
                      <TD>
                        <Button
                          variant={a.is_active ? "secondary" : "outline"}
                          size="sm"
                          onClick={async () => {
                            const nextActive = !a.is_active;
                            setRows((prev) =>
                              prev.map((x) => (x.id === a.id ? { ...x, is_active: nextActive } : x)),
                            );
                            try {
                              await updateAdmin(a.id, {
                                username: a.username,
                                email: a.email,
                                role: a.role,
                                is_active: nextActive,
                              });
                              toast.success("Status admin tersimpan.");
                            } catch (e: any) {
                              setRows((prev) =>
                                prev.map((x) => (x.id === a.id ? { ...x, is_active: a.is_active } : x)),
                              );
                              toast.error(e?.message ?? "Gagal menyimpan status.");
                            }
                          }}
                        >
                          {a.is_active ? "Aktif" : "Nonaktif"}
                        </Button>
                      </TD>
                      <TD>{formatDateTime(a.created_at)}</TD>
                      <TD>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelected(a);
                              setForm({
                                username: a.username,
                                email: a.email,
                                role: a.role,
                                password: "",
                                is_active: a.is_active,
                              });
                              setEditOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelected(a);
                              setDeleteOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen} title="Buat Admin">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={form.username}
              onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
              placeholder="username"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="email"
              type="email"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={form.role}
                onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as Role }))}
              >
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={form.is_active ? "active" : "inactive"}
                onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.value === "active" }))}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <Input
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              placeholder="password"
              type="password"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="w-full" onClick={() => setCreateOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              className="w-full"
              disabled={saving}
              onClick={async () => {
                if (!form.username || !form.email || !form.password) {
                  toast.error("Username, email, dan password wajib.");
                  return;
                }
                setSaving(true);
                try {
                  const created = await createAdmin({
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    password: form.password,
                    is_active: form.is_active,
                  });
                  setRows((prev) => [created, ...prev]);
                  toast.success("Admin dibuat.");
                  setCreateOpen(false);
                } catch (e: any) {
                  toast.error(e?.message ?? "Gagal membuat admin.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen} title="Edit Admin">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={form.username}
              onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
              placeholder="username"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={form.email}
              onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
              placeholder="email"
              type="email"
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={form.role}
                onChange={(e) => setForm((s) => ({ ...s, role: e.target.value as Role }))}
              >
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={form.is_active ? "active" : "inactive"}
                onChange={(e) => setForm((s) => ({ ...s, is_active: e.target.value === "active" }))}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password (opsional)</label>
            <Input
              value={form.password}
              onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
              placeholder="(kosongkan jika tidak diubah)"
              type="password"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="w-full" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              className="w-full"
              disabled={saving || !selected}
              onClick={async () => {
                if (!selected) return;
                if (!form.username || !form.email) {
                  toast.error("Username dan email wajib.");
                  return;
                }
                setSaving(true);
                const prev = selected;
                setRows((list) =>
                  list.map((x) =>
                    x.id === selected.id
                      ? { ...x, username: form.username, email: form.email, role: form.role, is_active: form.is_active }
                      : x,
                  ),
                );
                try {
                  const updated = await updateAdmin(selected.id, {
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    is_active: form.is_active,
                    ...(form.password ? { password: form.password } : {}),
                  });
                  setRows((list) => list.map((x) => (x.id === selected.id ? updated : x)));
                  toast.success("Admin tersimpan.");
                  setEditOpen(false);
                } catch (e: any) {
                  setRows((list) => list.map((x) => (x.id === prev.id ? prev : x)));
                  toast.error(e?.message ?? "Gagal menyimpan admin.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Hapus Admin?">
        <div className="space-y-4">
          <div className="text-sm text-[var(--da-text-secondary)]">
            Anda yakin ingin menghapus <span className="font-medium text-[var(--da-text-primary)]">{selected?.email}</span>?
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              className="w-full"
              disabled={saving || !selected}
              onClick={async () => {
                if (!selected) return;
                setSaving(true);
                const id = selected.id;
                const prev = rows;
                setRows((list) => list.filter((x) => x.id !== id));
                try {
                  await deleteAdmin(id);
                  toast.success("Admin dihapus.");
                  setDeleteOpen(false);
                } catch (e: any) {
                  setRows(prev);
                  toast.error(e?.message ?? "Gagal menghapus admin.");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
