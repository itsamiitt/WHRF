import Link from "next/link";

import { type Role } from "@prisma/client";

import { LogoutButton } from "@/components/admin/logout-button";

type AdminShellProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role: Role;
  };
  children: React.ReactNode;
};

function formatRole(role: Role) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="admin-layout">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <Link href="/admin">WRHW Admin</Link>
            <p>Content, leads, and publishing for the new full-stack app.</p>
          </div>

          <nav className="admin-nav" aria-label="Admin navigation">
            <Link href="/admin">Overview</Link>
            <Link href="/admin/content">Content</Link>
            <Link href="/admin/leads">Leads</Link>
            <Link href="/admin/team">Team</Link>
            <Link href="/admin/settings">Settings</Link>
            <Link href="/" target="_blank">
              View Live Site
            </Link>
          </nav>

          <div className="admin-card">
            <h4 style={{ marginBottom: "6px" }}>{user.name || "WRHW User"}</h4>
            <p className="admin-muted" style={{ marginTop: 0 }}>
              {user.email}
            </p>
            <p className="admin-muted">Role: {formatRole(user.role)}</p>
            <LogoutButton />
          </div>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
