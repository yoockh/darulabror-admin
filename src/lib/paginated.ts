import type { Paginated } from "@/lib/types";

export function unwrapPaginated<T>(value: Paginated<T>): T[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    if (Array.isArray((value as any).items)) return (value as any).items as T[];
    if (Array.isArray((value as any).data)) return (value as any).data as T[];
  }
  return [];
}
