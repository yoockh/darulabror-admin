import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--da-accent)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--da-green)] text-white hover:bg-[var(--da-green-2)]",
  secondary:
    "bg-[var(--da-bg)] text-[var(--da-text-primary)] border border-[var(--da-border)] hover:bg-white",
  outline:
    "bg-transparent text-[var(--da-text-primary)] border border-[var(--da-border)] hover:bg-[var(--da-bg)]",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

// Minimal `asChild` helper (shadcn-style)
export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
