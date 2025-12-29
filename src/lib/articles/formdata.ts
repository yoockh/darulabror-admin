import type { OutputData } from "@editorjs/editorjs";
import type { ArticleStatus } from "@/lib/types";

export type ArticleFormDataInput = {
  title: string;
  author: string;
  status: ArticleStatus;
  content: OutputData;
  photoHeaderFile?: File | null;
  deletePhotoHeader?: boolean;
  pendingFiles?: Record<string, File>;
};

export function buildArticleFormData(input: ArticleFormDataInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("author", input.author);
  fd.append("status", input.status);
  fd.append("content", JSON.stringify(input.content ?? { blocks: [] }));

  if (input.photoHeaderFile) {
    fd.append("photo_header", input.photoHeaderFile);
  } else if (input.deletePhotoHeader) {
    // backend boleh ignore field ini jika tidak dipakai
    fd.append("delete_photo_header", "1");
  }

  const pending = input.pendingFiles ?? {};
  for (const [key, file] of Object.entries(pending)) {
    // Field name untuk inline media tidak terdokumentasi di repo.
    // Kita kirim sebagai media_files dengan filename berisi key agar backend bisa mapping.
    fd.append("media_files", file, key);
  }
  if (Object.keys(pending).length > 0) {
    fd.append("media_keys", JSON.stringify(Object.keys(pending)));
  }

  return fd;
}
