"use client";

import * as React from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputData } from "@editorjs/editorjs";
import { cn } from "@/lib/utils";

export type BlocksEditorHandle = {
  save: () => Promise<OutputData>;
  clear: () => Promise<void>;
};

export type BlocksEditorProps = {
  initialData?: OutputData;
  className?: string;
  onChange?: (data: OutputData) => void;
  onAddPendingFile?: (fileKey: string, file: File) => void;
};

function createFileKey() {
  // stable enough for client-side mapping
  return `f_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export const BlocksEditor = React.forwardRef<BlocksEditorHandle, BlocksEditorProps>(
  function BlocksEditor({ initialData, className, onChange, onAddPendingFile }, ref) {
    const holderId = React.useId();
    const editorRef = React.useRef<EditorJS | null>(null);
    const latestOnChange = React.useRef(onChange);
    latestOnChange.current = onChange;

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Backspace" && e.key !== "Delete") return;
      const editor = editorRef.current as any;
      if (!editor) return;

      const active = document.activeElement as HTMLElement | null;
      // If user is typing inside an input/caption/contenteditable, don't hijack deletion.
      if (active) {
        if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") return;
        if (active.isContentEditable) return;
        if (active.closest?.(".cdx-input, [contenteditable='true']")) return;
      }

      try {
        const idx = editor?.blocks?.getCurrentBlockIndex?.();
        if (typeof idx !== "number" || idx < 0) return;
        const block = editor?.blocks?.getBlockByIndex?.(idx);
        const name = (block as any)?.name;
        if (name !== "image") return;

        e.preventDefault();
        editor.blocks.delete(idx);
      } catch {
        // ignore
      }
    }, []);

    React.useImperativeHandle(ref, () => ({
      save: async () => {
        if (!editorRef.current) return { blocks: [] } as any;
        return editorRef.current.save();
      },
      clear: async () => {
        if (!editorRef.current) return;
        await editorRef.current.clear();
      },
    }));

    React.useEffect(() => {
      let cancelled = false;
      (async () => {
        const Editor = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const embedMod = await import("@editorjs/embed");
        const Embed = ((embedMod as any).default ?? (embedMod as any)) as any;

        if (cancelled) return;

        const editor = new Editor({
          holder: holderId,
          placeholder: "Tulis konten artikel...",
          autofocus: false,
          data: initialData,
          tools: {
            embed: {
              class: Embed as any,
              inlineToolbar: false,
              toolbox: {
                title: "YouTube",
                icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21.6 7.2c-.2-1.1-1.1-2-2.2-2.2C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.4.4C3.5 5.2 2.6 6.1 2.4 7.2 2 9 2 12 2 12s0 3 .4 4.8c.2 1.1 1.1 2 2.2 2.2 1.8.4 7.4.4 7.4.4s5.6 0 7.4-.4c1.1-.2 2-1.1 2.2-2.2.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>',
              },
              config: {
                services: {
                  youtube: true,
                },
              },
            },
            header: {
              class: Header as any,
              inlineToolbar: true,
              config: {
                placeholder: "Judul section",
                levels: [2, 3, 4],
                defaultLevel: 2,
              },
            },
            list: {
              class: List as any,
              inlineToolbar: true,
            },
            quote: {
              class: Quote as any,
              inlineToolbar: true,
            },
            image: {
              class: ImageTool as any,
              config: {
                captionPlaceholder: "Caption (opsional)",
                uploader: {
                  uploadByFile: async (file: File) => {
                    const key = createFileKey();
                    onAddPendingFile?.(key, file);
                    const url = URL.createObjectURL(file);
                    return {
                      success: 1,
                      file: {
                        url,
                        // simpan key agar bisa dipakai saat build FormData
                        fileKey: key,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                      },
                    };
                  },
                },
              },
            },
          },
          async onChange() {
            if (!editorRef.current) return;
            try {
              const data = await editorRef.current.save();
              latestOnChange.current?.(data);
            } catch {
              // ignore
            }
          },
        });

        editorRef.current = editor as any;
      })();

      return () => {
        cancelled = true;
        const ed = editorRef.current as any;
        editorRef.current = null;
        if (ed?.destroy) ed.destroy();
      };
      // initialData intentionally only used on first mount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className={cn(
          "rounded-md border border-[var(--da-border)] bg-[var(--da-surface-2)] p-3 text-[var(--da-text-primary)]",
          "[&_.ce-block__content]:max-w-none [&_.ce-toolbar__content]:max-w-none",
          className,
        )}
        onKeyDown={handleKeyDown}
      >
        <div id={holderId} />
      </div>
    );
  },
);
