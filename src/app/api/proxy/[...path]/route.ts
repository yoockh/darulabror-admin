import { getApiBaseUrl } from "@/lib/config";

export const runtime = "nodejs";

type Params = { path?: string[] };

function buildTargetUrl(requestUrl: string, params: Params) {
  const base = getApiBaseUrl();
  const incoming = new URL(requestUrl);

  const pathname = `/${(params.path ?? []).join("/")}`;
  const target = new URL(pathname, base);
  target.search = incoming.search;
  return target;
}

function filterRequestHeaders(headers: Headers) {
  const out = new Headers();
  for (const [key, value] of headers.entries()) {
    const k = key.toLowerCase();
    // hop-by-hop / runtime-managed headers
    if (
      k === "host" ||
      k === "connection" ||
      k === "content-length" ||
      k === "accept-encoding" ||
      k === "x-forwarded-for" ||
      k === "x-forwarded-host" ||
      k === "x-forwarded-proto"
    ) {
      continue;
    }
    out.set(key, value);
  }
  return out;
}

async function handler(request: Request, ctx: { params: Params }) {
  const targetUrl = buildTargetUrl(request.url, ctx.params);
  const method = request.method.toUpperCase();

  // Same-origin requests shouldn't need CORS, but OPTIONS can happen in tooling.
  if (method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const headers = filterRequestHeaders(request.headers);

  // Forward body for non-GET/HEAD
  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const buf = await request.arrayBuffer();
    body = buf.byteLength > 0 ? buf : undefined;
  }

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body: body as any,
    cache: "no-store",
  });

  const resHeaders = new Headers(upstream.headers);
  // prevent caching surprises
  resHeaders.set("cache-control", "no-store");

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
