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

        if (cancelled) return;

        const editor = new Editor({
          holder: holderId,
          placeholder: "Tulis konten artikel...",
          autofocus: false,
          data: initialData,
          tools: {
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
      >
        <div id={holderId} />
      </div>
    );
  },
);
