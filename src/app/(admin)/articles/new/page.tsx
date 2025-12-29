"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { OutputData } from "@editorjs/editorjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BlocksEditor, type BlocksEditorHandle } from "@/components/articles/blocks-editor";
import { createArticle } from "@/lib/api/endpoints";
import { buildArticleFormData } from "@/lib/articles/formdata";
import type { ArticleStatus } from "@/lib/types";

export default function NewArticlePage() {
  const router = useRouter();

  const editorRef = React.useRef<BlocksEditorHandle | null>(null);
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [status, setStatus] = React.useState<ArticleStatus>("draft");
  const [saving, setSaving] = React.useState(false);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const [coverUrl, setCoverUrl] = React.useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = React.useState<Record<string, File>>({});

  const [content, setContent] = React.useState<OutputData>({ blocks: [] } as any);

  React.useEffect(() => {
    if (!coverFile) {
      setCoverUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">New Article</h1>
          <p className="text-sm text-[var(--da-text-secondary)]">Buat artikel baru.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/articles")}
            >Kembali</Button
          >
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
                  pendingFiles,
                });
                await createArticle(fd);
                toast.success("Artikel dibuat.");
                router.replace("/articles");
              } catch (e: any) {
                toast.error(e?.message ?? "Gagal membuat artikel.");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
                  onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                />
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="cover preview" className="mt-2 w-full rounded-md border" />
                ) : null}
              </div>
              <div className="text-xs text-[var(--da-text-secondary)]">
                Inline media yang ditambahkan di editor akan dikirim sebagai multipart bersama form.
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
