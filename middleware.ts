import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const TOKEN_COOKIE = "da_token";

const PUBLIC_ROUTES = new Set(["/login"]);

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isStaticAsset(pathname)) return NextResponse.next();

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const isPublic = PUBLIC_ROUTES.has(pathname);

  if (isPublic) {
    if (token) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
