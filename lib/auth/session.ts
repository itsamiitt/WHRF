import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/options";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await requireUser();

  if (!roles.includes(session.user.role)) {
    redirect("/admin");
  }

  return session;
}
