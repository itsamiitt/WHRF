import { Role } from "@prisma/client";

import { requireRole } from "@/lib/auth/session";

export default async function AdminSettingsPage() {
  await requireRole([Role.ADMIN]);

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Settings</h1>
          <p>Application and runtime settings for the Node + PostgreSQL app.</p>
        </div>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <h3>Runtime</h3>
          <p className="admin-muted">APP_URL</p>
          <pre>{process.env.APP_URL || "Not set"}</pre>
          <p className="admin-muted">DATABASE_URL</p>
          <pre>{process.env.DATABASE_URL ? "Configured" : "Not set"}</pre>
          <p className="admin-muted">NEXTAUTH_URL</p>
          <pre>{process.env.NEXTAUTH_URL || "Not set"}</pre>
        </article>

        <article className="admin-card">
          <h3>Uploads</h3>
          <p className="admin-muted">UPLOAD_DIR</p>
          <pre>{process.env.UPLOAD_DIR || "./public/uploads"}</pre>
          <p>
            Disk-backed uploads are prepared in the schema and config so we can add the media
            manager without changing the data model again.
          </p>
        </article>
      </div>
    </section>
  );
}
