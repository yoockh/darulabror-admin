import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, COOKIE_ROLE, COOKIE_TOKEN } from "@/lib/cookies";

export async function POST(request: Request) {
  const store = cookies();
  store.delete(COOKIE_TOKEN);
  store.delete(COOKIE_ROLE);
  store.delete(COOKIE_NAME);
  return NextResponse.redirect(new URL("/login", request.url));
}
