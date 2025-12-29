import { cookies } from "next/headers";
import { COOKIE_NAME, COOKIE_ROLE, COOKIE_TOKEN } from "@/lib/cookies";

export type Role = "admin" | "superadmin";

export type Session = {
  token: string;
  role: Role;
  name?: string;
};

function parseRole(value: string | undefined): Role | null {
  if (value === "admin" || value === "superadmin") return value;
  return null;
}

export function getSession(): Session | null {
  const store = cookies();
  const token = store.get(COOKIE_TOKEN)?.value;
  if (!token) return null;
  const role = parseRole(store.get(COOKIE_ROLE)?.value) ?? "admin";
  const name = store.get(COOKIE_NAME)?.value;
  return { token, role, name };
}
