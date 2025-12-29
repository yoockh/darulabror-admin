import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AccessDenied({
  title = "Akses Ditolak",
  description = "Anda tidak punya akses ke halaman ini.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--da-text-secondary)]">{description}</p>
          <div className="pt-4">
            <Button asChild className="w-full" variant="primary">
              <Link href="/dashboard">Kembali ke Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
