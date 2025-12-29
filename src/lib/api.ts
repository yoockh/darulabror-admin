import { getApiBaseUrl } from "@/lib/config";
import { clearToken, getToken } from "@/lib/token";
import type { ApiEnvelope } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type ApiFetchInit = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  token?: string;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: ApiFetchInit["query"]) {
  const url = new URL(path, getApiBaseUrl());
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}) {
  const url = buildUrl(path, init.query);

  const token = init.token ?? getToken() ?? undefined;
  const headers: Record<string, string> = {
    ...(init.headers ?? {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (!headers["Content-Type"] && init.body && typeof init.body === "string") {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text();


  if (res.status === 401) {
    // Auto logout + redirect
    if (typeof window !== "undefined") {
      clearToken();
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401, payload);
  }

  if (!res.ok) {
    const message =
      (typeof payload === "object" && payload && "message" in payload
        ? String((payload as any).message)
        : `Request failed (${res.status})`) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, payload);
  }

  // Envelope handling: {status,message,data}
  if (
    payload &&
    typeof payload === "object" &&
    ("data" in (payload as any) || "message" in (payload as any) || "status" in (payload as any))
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
}
