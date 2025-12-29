"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listContacts, listRegistrations } from "@/lib/api/endpoints";
import { unwrapPaginated } from "@/lib/paginated";
import type { ContactDTO, RegistrationDTO } from "@/lib/types";

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [registrations, setRegistrations] = React.useState<RegistrationDTO[]>([]);
  const [contacts, setContacts] = React.useState<ContactDTO[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [reg, con] = await Promise.all([
          listRegistrations({ page: 1, limit: 100 }),
          listContacts({ page: 1, limit: 100 }),
        ]);
        if (cancelled) return;
        setRegistrations(unwrapPaginated(reg));
        setContacts(unwrapPaginated(con));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const regCounts = React.useMemo(() => {
    const base = { new: 0, validate: 0, process: 0, done: 0 } as Record<string, number>;
    for (const r of registrations) {
      const s = String((r as any).status ?? "new");
      base[s] = (base[s] ?? 0) + 1;
    }
    return base;
  }, [registrations]);

  const contactCounts = React.useMemo(() => {
    const base = { new: 0, in_progress: 0, done: 0 } as Record<string, number>;
    for (const c of contacts) {
      const s = String((c as any).status ?? "new");
      base[s] = (base[s] ?? 0) + 1;
    }
    return base;
  }, [contacts]);

  const recentRegistrations = React.useMemo(() => registrations.slice(0, 5), [registrations]);
  const recentContacts = React.useMemo(() => contacts.slice(0, 5), [contacts]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--da-text-secondary)]">Ringkasan pekerjaan hari ini.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Registrations (limit 100)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>new: {regCounts.new ?? 0}</div>
                <div>validate: {regCounts.validate ?? 0}</div>
                <div>process: {regCounts.process ?? 0}</div>
                <div>done: {regCounts.done ?? 0}</div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contacts (limit 100)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>new: {contactCounts.new ?? 0}</div>
                <div>in_progress: {contactCounts.in_progress ?? 0}</div>
                <div>done: {contactCounts.done ?? 0}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {recentRegistrations.length ? (
                  recentRegistrations.map((r) => (
                    <div key={String(r.id)} className="flex items-center justify-between">
                      <div className="truncate">{String((r as any).full_name ?? r.id)}</div>
                      <div className="text-[var(--da-text-secondary)]">{String((r as any).status ?? "-")}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-[var(--da-text-secondary)]">Belum ada data</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                {recentContacts.length ? (
                  recentContacts.map((c) => (
                    <div key={String(c.id)} className="flex items-center justify-between">
                      <div className="truncate">{String((c as any).subject ?? c.id)}</div>
                      <div className="text-[var(--da-text-secondary)]">{String((c as any).status ?? "-")}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-[var(--da-text-secondary)]">Belum ada data</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
