import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
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
  asChild,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild) {
    const child = React.Children.only(children);
    if (!React.isValidElement(child)) return null;
    return React.cloneElement(child as any, {
      className: cn((child as any).props?.className, classes),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
