import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--da-glass-border)] bg-[var(--da-input-bg)] px-3 text-sm text-[var(--da-text-primary)] outline-none backdrop-blur-xl transition focus:ring-2 focus:ring-[var(--da-primary)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
