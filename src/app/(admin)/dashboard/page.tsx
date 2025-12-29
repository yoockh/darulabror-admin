"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { listContacts, listRegistrations } from "@/lib/api/endpoints";
import { unwrapPaginated } from "@/lib/paginated";
import { contactStatusLabel, registrationStatusLabel } from "@/lib/status";
import type { ContactDTO, RegistrationDTO } from "@/lib/types";

function StatCard({
  title,
  context,
  value,
  href,
  variant,
}: {
  title: string;
  context: string;
  value: number;
  href: string;
  variant: "default" | "warning" | "success";
}) {
  return (
    <Link href={href} className="block">
      <Card className="hover:cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>{title}</span>
            <Badge variant={variant as any}>{context}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-[var(--da-text-primary)]">{value}</div>
          <div className="mt-1 text-sm text-[var(--da-text-secondary)]">Klik untuk lihat list</div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Donut({
  parts,
}: {
  parts: Array<{ label: string; value: number; color: string }>;
}) {
  const total = parts.reduce((a, p) => a + (Number.isFinite(p.value) ? p.value : 0), 0);
  const size = 120;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(229,231,235,0.10)"
            strokeWidth={stroke}
          />
          {parts.map((p, i) => {
            const v = Number.isFinite(p.value) ? p.value : 0;
            const frac = total > 0 ? v / total : 0;
            const dash = frac * c;
            const dashArray = `${dash} ${c - dash}`;
            const dashOffset = -offset;
            offset += dash;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={p.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-xs text-[var(--da-text-secondary)]">Total</div>
            <div className="text-lg font-semibold text-[var(--da-text-primary)]">{total}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-[var(--da-text-primary)]">{p.label}</span>
            </div>
            <div className="text-[var(--da-text-secondary)]">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

      <Card>
        <CardHeader>
          <CardTitle>Report Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="grid gap-4 md:grid-cols-4">
                  <StatCard
                    context="Registrations"
                    title={registrationStatusLabel("new")}
                    value={regCounts.new ?? 0}
                    href="/registrations?status=new"
                    variant="default"
                  />
                  <StatCard
                    context="Registrations"
                    title={registrationStatusLabel("validate")}
                    value={regCounts.validate ?? 0}
                    href="/registrations?status=validate"
                    variant="warning"
                  />
                  <StatCard
                    context="Registrations"
                    title={registrationStatusLabel("process")}
                    value={regCounts.process ?? 0}
                    href="/registrations?status=process"
                    variant="warning"
                  />
                  <StatCard
                    context="Registrations"
                    title={registrationStatusLabel("done")}
                    value={regCounts.done ?? 0}
                    href="/registrations?status=done"
                    variant="success"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-[var(--da-border)] bg-[var(--da-glass-bg)] p-4">
                <div className="text-sm font-semibold text-[var(--da-text-primary)]">Distribusi Status</div>
                <div className="mt-3">
                  <Donut
                    parts={[
                      { label: registrationStatusLabel("new"), value: regCounts.new ?? 0, color: "rgba(229,231,235,0.35)" },
                      { label: registrationStatusLabel("validate"), value: regCounts.validate ?? 0, color: "rgba(250,204,21,0.75)" },
                      { label: registrationStatusLabel("process"), value: regCounts.process ?? 0, color: "rgba(59,130,246,0.65)" },
                      { label: registrationStatusLabel("done"), value: regCounts.done ?? 0, color: "rgba(16,185,129,0.85)" },
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                context="Contacts"
                title={contactStatusLabel("new")}
                value={contactCounts.new ?? 0}
                href="/contacts?status=new"
                variant="default"
              />
              <StatCard
                context="Contacts"
                title={contactStatusLabel("in_progress")}
                value={contactCounts.in_progress ?? 0}
                href="/contacts?status=in_progress"
                variant="warning"
              />
              <StatCard
                context="Contacts"
                title={contactStatusLabel("done")}
                value={contactCounts.done ?? 0}
                href="/contacts?status=done"
                variant="success"
              />
            </div>
          )}
        </CardContent>
      </Card>

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
                      <div className="text-[var(--da-text-secondary)]">
                        {registrationStatusLabel(String((r as any).status ?? ""))}
                      </div>
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
                      <div className="text-[var(--da-text-secondary)]">
                        {contactStatusLabel(String((c as any).status ?? ""))}
                      </div>
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
