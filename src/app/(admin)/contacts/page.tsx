"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TBody, THead, TR, TH, TD, TableEmptyState } from "@/components/ui/table";
import { listContacts } from "@/lib/api/endpoints";
import { unwrapPaginated } from "@/lib/paginated";
import { formatDateTime } from "@/lib/format";
import { contactStatusLabel } from "@/lib/status";
import type { ContactDTO, ContactStatus } from "@/lib/types";

function statusBadgeVariant(status?: string) {
  if (status === "done") return "success";
  if (status === "in_progress") return "warning";
  if (status === "new") return "default";
  return "default";
}

function ContactsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const status = (searchParams.get("status") ?? "all") as "all" | ContactStatus;

  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<ContactDTO[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await listContacts({
          page,
          limit,
          status: status === "all" ? undefined : status,
        });
        if (cancelled) return;
        setRows(unwrapPaginated(res));
      } catch (e: any) {
        toast.error(e?.message ?? "Gagal memuat data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, limit, status]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) => {
      const fullName = String((c as any).full_name ?? "").toLowerCase();
      const email = String((c as any).email ?? "").toLowerCase();
      const subject = String((c as any).subject ?? "").toLowerCase();
      return fullName.includes(q) || email.includes(q) || subject.includes(q);
    });
  }, [rows, query]);

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set(key, value);
    if (key !== "page") sp.set("page", "1");
    router.push(`/contacts?${sp.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Contacts</h1>
        <p className="text-sm text-[var(--da-text-secondary)]">List pesan masuk.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onChange={(e) => setParam("status", e.target.value)}>
                <option value="all">Semua</option>
                <option value="new">{contactStatusLabel("new")}</option>
                <option value="in_progress">{contactStatusLabel("in_progress")}</option>
                <option value="done">{contactStatusLabel("done")}</option>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari full_name / email / subject"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
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
                  <TH>ID</TH>
                  <TH>Full Name</TH>
                  <TH>Email</TH>
                  <TH>Subject</TH>
                  <TH>Status</TH>
                  <TH>Created At</TH>
                  <TH>Action</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.length === 0 ? (
                  <TableEmptyState colSpan={7} title="Belum ada data" />
                ) : (
                  filtered.map((c) => (
                    <TR key={String(c.id)}>
                      <TD>{String(c.id)}</TD>
                      <TD>{String((c as any).full_name ?? "-")}</TD>
                      <TD>{String((c as any).email ?? "-")}</TD>
                      <TD>{String((c as any).subject ?? "-")}</TD>
                      <TD>
                        <Badge variant={statusBadgeVariant(String((c as any).status ?? "")) as any}>
                          {contactStatusLabel(String((c as any).status ?? ""))}
                        </Badge>
                      </TD>
                      <TD>{formatDateTime(String((c as any).created_at ?? ""))}</TD>
                      <TD>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/contacts/${c.id}`}>Detail</Link>
                        </Button>
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          )}

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="text-sm text-[var(--da-text-secondary)]">Page {page}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParam("page", String(Math.max(1, page - 1)))}
                disabled={page <= 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParam("page", String(page + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      }
    >
      <ContactsInner />
    </Suspense>
  );
}
