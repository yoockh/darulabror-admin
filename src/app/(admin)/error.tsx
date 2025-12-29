"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--da-text-secondary)]">{error.message}</p>
          <div className="pt-4">
            <Button type="button" onClick={reset}>
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
