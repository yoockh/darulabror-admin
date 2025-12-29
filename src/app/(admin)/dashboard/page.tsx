import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session";

export default function DashboardPage() {
  const session = getSession();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--da-text-primary)]">Dashboard</h1>
        <p className="text-sm text-[var(--da-text-secondary)]">
          Selamat datang{session?.name ? `, ${session.name}` : ""}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--da-text-secondary)]">
              Ringkasan akan ditampilkan setelah endpoint backend dikonfirmasi.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--da-text-secondary)]">
              Ringkasan akan ditampilkan setelah endpoint backend dikonfirmasi.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--da-text-secondary)]">
              Ringkasan akan ditampilkan setelah endpoint backend dikonfirmasi.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
