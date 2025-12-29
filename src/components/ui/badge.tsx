import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-white/5 text-[var(--da-text-primary)] border-[var(--da-glass-border)] backdrop-blur-xl",
  success:
    "bg-[rgba(16,185,129,0.14)] text-[rgb(110,231,183)] border-[rgba(16,185,129,0.25)] backdrop-blur-xl",
  warning:
    "bg-[rgba(250,204,21,0.12)] text-[rgb(253,230,138)] border-[rgba(250,204,21,0.22)] backdrop-blur-xl",
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
