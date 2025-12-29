import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-white/50 text-[var(--da-text-primary)] border-[var(--da-glass-border)] backdrop-blur-xl",
  success:
    "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 backdrop-blur-xl",
  warning:
    "bg-amber-500/10 text-amber-800 border-amber-500/20 backdrop-blur-xl",
  danger: "bg-red-500/10 text-red-700 border-red-500/20 backdrop-blur-xl",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
