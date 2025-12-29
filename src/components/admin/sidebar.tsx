import { getSession } from "@/lib/session";
import { SidebarClient } from "@/components/admin/sidebar-client";

export function Sidebar() {
  const session = getSession();
  const role = session?.role ?? "admin";

  return <SidebarClient role={role} />;
}
