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
import { Dialog } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TBody, THead, TR, TH, TD, TableEmptyState } from "@/components/ui/table";
import { deleteArticle, listArticles } from "@/lib/api/endpoints";
import { unwrapPaginated } from "@/lib/paginated";
import { formatDateTime } from "@/lib/format";
import { articleStatusLabel } from "@/lib/status";
import type { ArticleDTO, ArticleStatus } from "@/lib/types";

function statusBadgeVariant(status?: string) {
  if (status === "published") return "success";
  if (status === "draft") return "warning";
  return "default";
}

function getArticleId(a: any): string | number | null {
  const id =
    a?.id ??
    a?.article_id ??
    a?.articleId ??
    a?.article_uuid ??
    a?.uuid ??
    a?.slug ??
    a?.article_slug;
  if (id === undefined || id === null || id === "") return null;
  return id;
}

function ArticlesInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const status = (searchParams.get("status") ?? "all") as "all" | ArticleStatus;

  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState<ArticleDTO[]>([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [selected, setSelected] = React.useState<ArticleDTO | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await listArticles({
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
    return rows.filter((a) => {
      const title = String(a.title ?? "").toLowerCase();
      const author = String(a.author ?? "").toLowerCase();
      return title.includes(q) || author.includes(q);
    });
  }, [rows, query]);

  function setParam(key: string, value: string) {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set(key, value);
    if (key !== "page") sp.set("page", "1");
    router.push(`/articles?${sp.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Articles</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">Kelola artikel.</p>
        </div>
        <Button asChild variant="primary">
          <Link href="/articles/new">Tambah Artikel</Link>
        </Button>
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
                <option value="draft">{articleStatusLabel("draft")}</option>
                <option value="published">{articleStatusLabel("published")}</option>
              </Select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari title / author"
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
                  <TH>Title</TH>
                  <TH>Author</TH>
                  <TH>Status</TH>
                  <TH>Updated</TH>
                  <TH>Action</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.length === 0 ? (
                  <TableEmptyState colSpan={5} title="Belum ada artikel" />
                ) : (
                  filtered.map((a, idx) => {
                    const articleId = getArticleId(a);
                    const hrefId = articleId ? encodeURIComponent(String(articleId)) : null;
                    return (
                      <TR key={String(articleId ?? `${a.title ?? "row"}-${idx}`)}>
                        <TD className="font-medium">{a.title}</TD>
                        <TD>{a.author}</TD>
                        <TD>
                          <Badge variant={statusBadgeVariant(a.status) as any}>
                            {articleStatusLabel(String(a.status ?? ""))}
                          </Badge>
                        </TD>
                        <TD>{formatDateTime(String(a.updated_at ?? a.created_at ?? ""))}</TD>
                        <TD>
                          <div className="flex flex-wrap gap-2">
                            {articleId ? (
                              <Button asChild variant="outline" size="sm">
                                <Link href={`/articles/${hrefId}`}>Edit</Link>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Edit
                              </Button>
                            )}
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
                    );
                  })
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
              <Button variant="outline" size="sm" onClick={() => setParam("page", String(page + 1))}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Hapus Artikel?">
        <div className="space-y-4">
          <div className="text-sm text-[var(--da-text-secondary)]">
            Anda yakin ingin menghapus <span className="font-medium text-[var(--da-text-primary)]">{selected?.title}</span>?
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="w-full" onClick={() => setDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              className="w-full"
              disabled={deleting || !selected}
              onClick={async () => {
                if (!selected) return;
                setDeleting(true);
                const id = getArticleId(selected as any);
                const prev = rows;
                if (id) {
                  setRows((list) =>
                    list.filter((x) => getArticleId(x as any) !== id),
                  );
                }
                try {
                  if (!id) {
                    throw new Error("ID artikel tidak valid.");
                  }
                  await deleteArticle(id);
                  toast.success("Artikel dihapus.");
                  setDeleteOpen(false);
                } catch (e: any) {
                  setRows(prev);
                  toast.error(e?.message ?? "Gagal menghapus artikel.");
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default function ArticlesPage() {
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
      <ArticlesInner />
    </Suspense>
  );
}
