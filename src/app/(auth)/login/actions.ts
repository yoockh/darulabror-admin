"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { API_PATHS } from "@/lib/config";
import {
  COOKIE_MAX_AGE_SECONDS,
  COOKIE_NAME,
  COOKIE_ROLE,
  COOKIE_TOKEN,
} from "@/lib/cookies";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginResponse = {
  token?: string;
  access_token?: string;
  accessToken?: string;
  role?: string;
  name?: string;
  user?: { name?: string; role?: string };
};

export async function loginAction(formData: FormData) {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, message: "Email atau password tidak valid." };
  }

  const res = await apiFetch<LoginResponse>(API_PATHS.authLogin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const token = res.accessToken ?? res.access_token ?? res.token;
  const role = res.role ?? res.user?.role ?? "admin";
  const name = res.name ?? res.user?.name;

  if (!token) {
    return {
      ok: false as const,
      message:
        "Login berhasil tapi token tidak ditemukan. Cek bentuk response backend.",
    };
  }

  const secure = process.env.NODE_ENV === "production";

  const store = cookies();
  store.set(COOKIE_TOKEN, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  store.set(COOKIE_ROLE, role, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
  if (name) {
    store.set(COOKIE_NAME, name, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
  }

  redirect("/dashboard");
}
