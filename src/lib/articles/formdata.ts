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
    // swagger: photo_header_file
    fd.append("photo_header_file", input.photoHeaderFile);
  } else if (input.deletePhotoHeader) {
    // swagger doesn't define a delete flag; keep compatibility for backends that support it
    fd.append("delete_photo_header", "1");
  }

  const pending = input.pendingFiles ?? {};
  for (const [key, file] of Object.entries(pending)) {
    // swagger: content_files[<upload_key>]
    fd.append(`content_files[${key}]`, file);
  }

  return fd;
}
