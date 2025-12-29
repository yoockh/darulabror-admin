import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn(
          "w-full caption-bottom text-sm text-[var(--da-text-primary)]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function THead({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-[var(--da-border)]", className)} {...props} />;
}

export function TBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TR({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--da-border)] transition-colors hover:bg-white/50",
        className,
      )}
      {...props}
    />
  );
}

export function TH({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle font-medium text-[var(--da-text-secondary)]",
        className,
      )}
      {...props}
    />
  );
}

export function TD({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}

export function TableEmptyState({
  colSpan,
  title = "Belum ada data",
  description,
  action,
}: {
  colSpan: number;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <TR>
      <TD colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <div className="text-sm font-medium text-[var(--da-text-primary)]">{title}</div>
          {description ? (
            <div className="text-sm text-[var(--da-text-secondary)]">{description}</div>
          ) : null}
          {action ? <div className="pt-1">{action}</div> : null}
        </div>
      </TD>
    </TR>
  );
}

