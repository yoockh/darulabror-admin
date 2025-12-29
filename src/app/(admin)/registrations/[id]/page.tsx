"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import { getRegistration, patchRegistrationStatus } from "@/lib/api/endpoints";
import { registrationStatusLabel } from "@/lib/status";
import type { RegistrationDTO, RegistrationStatus } from "@/lib/types";

function statusBadgeVariant(status?: string) {
  if (status === "done") return "success";
  if (status === "validate" || status === "process") return "warning";
  if (status === "new") return "default";
  return "default";
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1">
      <div className="text-xs text-[var(--da-text-secondary)]">{label}</div>
      <div className="text-sm text-[var(--da-text-primary)]">{value}</div>
    </div>
  );
}

export default function RegistrationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [data, setData] = React.useState<RegistrationDTO | null>(null);
  const [status, setStatus] = React.useState<RegistrationStatus>("new");

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getRegistration(id);
        if (cancelled) return;
        setData(res);
        setStatus(((res as any).status ?? "new") as RegistrationStatus);
      } catch (e: any) {
        toast.error(e?.message ?? "Gagal memuat detail.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-sm text-[var(--da-text-secondary)]">Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Registration #{String(data.id)}</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">
            Created: {formatDateTime(String((data as any).created_at ?? ""))}
          </p>
        </div>
        <Badge variant={statusBadgeVariant(String((data as any).status ?? "")) as any}>
          {registrationStatusLabel(String((data as any).status ?? ""))}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nama Lengkap" value={String((data as any).full_name ?? "-")} />
              <Field label="Tipe Siswa" value={String((data as any).student_type ?? "-")} />
              <Field label="Email" value={String((data as any).email ?? "-")} />
              <Field label="No. HP" value={String((data as any).phone ?? "-")} />
              <Field label="NISN" value={String((data as any).nisn ?? "-")} />
              <Field label="Jenis Kelamin" value={String((data as any).gender ?? "-")} />
              <Field label="Tempat Lahir" value={String((data as any).place_of_birth ?? "-")} />
              <Field label="Tanggal Lahir" value={String((data as any).date_of_birth ?? "-")} />
              <Field label="Asal Sekolah" value={String((data as any).origin_school ?? "-")} />
              <Field label="Alamat" value={String((data as any).address ?? "-")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta & Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="new">{registrationStatusLabel("new")}</option>
                  <option value="validate">{registrationStatusLabel("validate")}</option>
                  <option value="process">{registrationStatusLabel("process")}</option>
                  <option value="done">{registrationStatusLabel("done")}</option>
                </Select>
              </div>
              <Button
                disabled={saving}
                onClick={async () => {
                  if (!id) {
                    toast.error("ID tidak valid.");
                    return;
                  }
                  setSaving(true);
                  const prev = (data as any).status;
                  setData({ ...data, status } as any);
                  try {
                    await patchRegistrationStatus(id, status);
                    toast.success("Status tersimpan.");
                  } catch (e: any) {
                    setData({ ...data, status: prev } as any);
                    toast.error(e?.message ?? "Gagal menyimpan status.");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Menyimpan..." : "Simpan Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Orang Tua</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--da-border)] bg-[var(--da-glass-bg)] p-4">
              <div className="text-sm font-semibold text-[var(--da-text-primary)]">Ayah</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Field label="Nama" value={String((data as any).father_name ?? "-")} />
                <Field label="Pekerjaan" value={String((data as any).father_occupation ?? "-")} />
                <Field label="No. HP" value={String((data as any).phone_father ?? "-")} />
                <Field label="Tanggal Lahir" value={String((data as any).date_of_birth_father ?? "-")} />
              </div>
            </div>

            <div className="rounded-xl border border-[var(--da-border)] bg-[var(--da-glass-bg)] p-4">
              <div className="text-sm font-semibold text-[var(--da-text-primary)]">Ibu</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Field label="Nama" value={String((data as any).mother_name ?? "-")} />
                <Field label="Pekerjaan" value={String((data as any).mother_occupation ?? "-")} />
                <Field label="No. HP" value={String((data as any).phone_mother ?? "-")} />
                <Field label="Tanggal Lahir" value={String((data as any).date_of_birth_mother ?? "-")} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
