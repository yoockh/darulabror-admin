"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--da-glass-bg-strong)",
          border: "1px solid var(--da-glass-border)",
          color: "var(--da-text-primary)",
          boxShadow: "var(--da-glass-shadow)",
          backdropFilter: "blur(16px)",
        },
      }}
    />
  );
}
