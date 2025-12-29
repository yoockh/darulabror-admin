"use client";

import * as React from "react";
import { toast } from "sonner";
import type { AdminDTO, Role } from "@/lib/types";
import { clearToken, getToken, setToken } from "@/lib/token";
import { getProfile as apiGetProfile, login as apiLogin } from "@/lib/api/endpoints";

type AuthState = {
  token: string | null;
  admin: AdminDTO | null;
  role: Role | null;
  isReady: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function extractToken(result: any): string | null {
  if (!result) return null;
  if (typeof result === "string") return result;
  return (
    result.token ??
    result.access_token ??
    result.accessToken ??
    result?.data?.token ??
    result?.data?.access_token ??
    result?.data?.accessToken ??
    null
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({
    token: null,
    admin: null,
    role: null,
    isReady: false,
  });

  const refreshProfile = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      setState((s) => ({ ...s, token: null, admin: null, role: null }));
      return;
    }
    try {
      const admin = await apiGetProfile();
      const role = (admin as any)?.role ?? null;
      setState((s) => ({ ...s, token, admin, role }));
    } catch {
      // kalau profile gagal, biarkan apiFetch handle 401 redirect
      setState((s) => ({ ...s, token }));
    }
  }, []);

  React.useEffect(() => {
    const token = getToken();
    setState((s) => ({ ...s, token, isReady: true }));
    if (token) {
      void refreshProfile();
    }
  }, [refreshProfile]);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const result = await apiLogin(email, password);
      const token = extractToken(result);
      if (!token) {
        toast.error("Login gagal: token tidak ditemukan.");
        return false;
      }
      setToken(token);
      setState((s) => ({ ...s, token }));
      await refreshProfile();
      return true;
    } catch (err: any) {
      toast.error(err?.message ?? "Login gagal.");
      return false;
    }
  }, [refreshProfile]);

  const logout = React.useCallback(() => {
    clearToken();
    setState({ token: null, admin: null, role: null, isReady: true });
    if (typeof window !== "undefined") window.location.href = "/login";
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
