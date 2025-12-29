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
import { getContact, patchContactStatus } from "@/lib/api/endpoints";
import type { ContactDTO, ContactStatus } from "@/lib/types";

function statusBadgeVariant(status?: string) {
  if (status === "done") return "success";
  if (status === "in_progress") return "warning";
  if (status === "new") return "default";
  return "default";
}

export default function ContactDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [data, setData] = React.useState<ContactDTO | null>(null);
  const [status, setStatus] = React.useState<ContactStatus>("new");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getContact(id);
        if (cancelled) return;
        setData(res);
        setStatus(((res as any).status ?? "new") as ContactStatus);
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

  const email = String((data as any).email ?? "");
  const subject = String((data as any).subject ?? "");
  const message = String((data as any).message ?? (data as any).content ?? "");
  const mailto = email
    ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Contact #{String(data.id)}</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">
            Created: {formatDateTime(String((data as any).created_at ?? ""))}
          </p>
        </div>
        <Badge variant={statusBadgeVariant(String((data as any).status ?? "")) as any}>
          {String((data as any).status ?? "-")}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pengirim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>Full Name: {String((data as any).full_name ?? "-")}</div>
              <div className="flex items-center justify-between gap-3">
                <div>Email: {email || "-"}</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(email);
                        toast.success("Email disalin.");
                      } catch {
                        toast.error("Gagal menyalin email.");
                      }
                    }}
                    disabled={!email}
                  >
                    Copy
                  </Button>
                  {mailto ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={mailto}>Email</a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="new">new</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </Select>
              </div>
              <Button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  const prev = (data as any).status;
                  setData({ ...data, status } as any);
                  try {
                    await patchContactStatus(id, status);
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
          <CardTitle>Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm whitespace-pre-wrap">{message || "-"}</div>
        </CardContent>
      </Card>
    </div>
  );
}
