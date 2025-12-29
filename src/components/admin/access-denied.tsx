import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccessDenied({
  title = "Akses Ditolak",
  description = "Kamu tidak punya izin untuk mengakses halaman ini.",
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
        </CardContent>
      </Card>
    </div>
  );
}
