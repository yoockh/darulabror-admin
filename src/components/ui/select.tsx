import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--da-glass-border)] bg-[var(--da-input-bg)] px-3 text-sm text-[var(--da-text-primary)] outline-none backdrop-blur-xl transition focus:ring-2 focus:ring-[var(--da-primary)]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
