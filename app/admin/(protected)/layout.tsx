export const dynamic = "force-dynamic";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireUser } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireUser();

  return <AdminShell user={session.user}>{children}</AdminShell>;
}
