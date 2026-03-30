import Link from "next/link";

import { Role } from "@prisma/client";

import { listAdminPages } from "@/lib/content/pages";
import { requireRole } from "@/lib/auth/session";

export default async function AdminContentIndexPage() {
  await requireRole([Role.ADMIN, Role.EDITOR]);
  const pages = await listAdminPages();

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Content</h1>
          <p>Manage draft and published revisions for every public route.</p>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>Slug</th>
              <th>Type</th>
              <th>Draft</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td>{page.slug}</td>
                <td>{page.pageType}</td>
                <td>{page.currentDraftId ? "Yes" : "No"}</td>
                <td>{page.publishedRevId ? "Yes" : "No"}</td>
                <td>
                  <Link href={`/admin/content/${page.id}`}>Open editor</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
