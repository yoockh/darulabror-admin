import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full rounded-xl border border-[var(--da-glass-border)] bg-white/60 px-3 py-2 text-sm text-[var(--da-text-primary)] outline-none backdrop-blur-xl transition focus:ring-2 focus:ring-[var(--da-accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
