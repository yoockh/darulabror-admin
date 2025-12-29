"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid var(--da-border)",
          color: "var(--da-text-primary)",
          boxShadow: "var(--da-card-shadow)",
        },
      }}
    />
  );
}
