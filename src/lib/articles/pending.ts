import type { OutputData } from "@editorjs/editorjs";

export function extractInlineMediaKeys(content: OutputData | null | undefined) {
  const keys: string[] = [];
  const blocks = content?.blocks ?? [];

  for (const block of blocks as any[]) {
    if (!block || block.type !== "image") continue;
    const fileKey = block?.data?.file?.fileKey;
    if (typeof fileKey === "string" && fileKey.trim()) keys.push(fileKey);
  }

  return keys;
}
