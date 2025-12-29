import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--da-glass-border)] bg-white/60 px-3 text-sm text-[var(--da-text-primary)] outline-none backdrop-blur-xl transition focus:ring-2 focus:ring-[var(--da-accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
