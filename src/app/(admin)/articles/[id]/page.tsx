"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BlocksEditor, type BlocksEditorHandle } from "@/components/articles/blocks-editor";
import { getArticle, updateArticle } from "@/lib/api/endpoints";
import { buildArticleFormData } from "@/lib/articles/formdata";
import type { ArticleDTO, ArticleStatus } from "@/lib/types";

function parseContent(content: unknown): OutputData {
  if (!content) return { blocks: [] } as any;
  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      return { blocks: [] } as any;
    }
  }
  if (typeof content === "object") return content as any;
  return { blocks: [] } as any;
}

export default function EditArticlePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const editorRef = React.useRef<BlocksEditorHandle | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [data, setData] = React.useState<ArticleDTO | null>(null);

  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [status, setStatus] = React.useState<ArticleStatus>("draft");

  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverUrl, setCoverUrl] = React.useState<string | null>(null);
  const [deleteCover, setDeleteCover] = React.useState(false);

  const [pendingFiles, setPendingFiles] = React.useState<Record<string, File>>({});
  const [content, setContent] = React.useState<OutputData>({ blocks: [] } as any);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getArticle(id);
        if (cancelled) return;
        setData(res);
        setTitle(res.title ?? "");
        setAuthor(res.author ?? "");
        setStatus((res.status ?? "draft") as ArticleStatus);
        setContent(parseContent((res as any).content));
      } catch (e: any) {
        toast.error(e?.message ?? "Gagal memuat artikel.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  React.useEffect(() => {
    if (!coverFile) {
      setCoverUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-sm text-[var(--da-text-secondary)]">Data tidak ditemukan.</div>;
  }

  const existingCover = (data as any).photo_header as string | undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Edit Article</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">#{String(data.id)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/articles")}>
            Kembali
          </Button>
          <Button
            variant="primary"
            disabled={saving}
            onClick={async () => {
              if (!title.trim() || !author.trim()) {
                toast.error("Title dan author wajib.");
                return;
              }
              setSaving(true);
              try {
                const latest = (await editorRef.current?.save()) ?? content;
                const fd = buildArticleFormData({
                  title: title.trim(),
                  author: author.trim(),
                  status,
                  content: latest,
                  photoHeaderFile: coverFile,
                  deletePhotoHeader: deleteCover,
                  pendingFiles,
                });
                const updated = await updateArticle(data.id, fd);
                setData(updated);
                toast.success("Artikel tersimpan.");
              } catch (e: any) {
                toast.error(e?.message ?? "Gagal menyimpan artikel.");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Author</label>
                <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Nama penulis" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Cover (photo_header)</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setCoverFile(e.target.files?.[0] ?? null);
                    setDeleteCover(false);
                  }}
                />

                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="cover preview" className="mt-2 w-full rounded-md border" />
                ) : existingCover && !deleteCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={existingCover} alt="cover" className="mt-2 w-full rounded-md border" />
                ) : null}

                {existingCover ? (
                  <div className="pt-2">
                    <Button
                      type="button"
                      variant={deleteCover ? "danger" : "outline"}
                      size="sm"
                      onClick={() => {
                        setCoverFile(null);
                        setDeleteCover((v) => !v);
                      }}
                    >
                      {deleteCover ? "Cover akan dihapus" : "Hapus Cover"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <BlocksEditor
              ref={editorRef}
              initialData={content}
              className="min-h-[60vh]"
              onChange={setContent}
              onAddPendingFile={(key, file) =>
                setPendingFiles((prev) => ({
                  ...prev,
                  [key]: file,
                }))
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
