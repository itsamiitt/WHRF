import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAuthSession } from "@/lib/auth/session";

export default async function AdminLoginPage() {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="admin-auth">
      <section className="admin-auth-card">
        <h1>Sign in to WRHW Admin</h1>
        <p>
          Use the seeded credentials to manage the landing page content, leads, and team.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
