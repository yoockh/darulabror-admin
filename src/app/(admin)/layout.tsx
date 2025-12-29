import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { getSession } from "@/lib/session";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = getSession();
  if (!session) redirect("/login");

  // Sidebar highlight sederhana berbasis pathname via client tidak diperlukan; default.
  return (
    <div className="min-h-screen bg-[var(--da-bg)] md:flex">
      <Sidebar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
}
