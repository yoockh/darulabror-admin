"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 5.1A10.9 10.9 0 0 1 12 5c6.5 0 10 7 10 7a18.6 18.6 0 0 1-3.1 4.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.1 6.1A18.6 18.6 0 0 0 2 12s3.5 7 10 7c1.1 0 2.2-.2 3.1-.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") ?? "/dashboard";
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Masuk ke admin panel Darul Abror.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const ok = await login(email, password);
              setLoading(false);
              if (ok) router.replace(from);
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--da-text-primary)]">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                placeholder="admin@domain.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--da-text-primary)]">Password</label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--da-text-secondary)] hover:text-[var(--da-text-primary)]"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-6 text-sm text-[var(--da-text-secondary)]">
          Memuat...
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
