"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDialogElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn(
        "w-full max-w-lg rounded-lg border border-[var(--da-border)] bg-white p-0 shadow-[var(--da-hover-shadow)]",
        className,
      )}
      onClose={() => onOpenChange(false)}
      onCancel={(e) => {
        e.preventDefault();
        onOpenChange(false);
      }}
    >
      <div className="border-b border-[var(--da-border)] px-5 py-4">
        <div className="text-sm font-semibold text-[var(--da-text-primary)]">{title}</div>
      </div>
      <div className="px-5 py-4">{children}</div>
    </dialog>
  );
}
