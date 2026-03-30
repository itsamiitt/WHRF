import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";

export default async function AdminOverviewPage() {
  await requireUser();

  const [leadCount, openLeadCount, pageCount, userCount, recentLeads, recentPages] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          status: {
            in: ["NEW", "CONTACTED", "QUALIFIED"]
          }
        }
      }),
      prisma.page.count(),
      prisma.user.count(),
      prisma.lead.findMany({
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }),
      prisma.page.findMany({
        orderBy: {
          updatedAt: "desc"
        },
        take: 5
      })
    ]);

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Overview</h1>
          <p>The Next.js app is now the home for public pages, CMS drafts, and stored leads.</p>
        </div>
        <div className="admin-actions">
          <Link className="admin-button-secondary" href="/" target="_blank">
            Open Site
          </Link>
          <Link className="admin-button" href="/admin/content">
            Manage Content
          </Link>
        </div>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <h3>Total Leads</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{leadCount}</p>
        </article>
        <article className="admin-card">
          <h3>Open Pipeline</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{openLeadCount}</p>
        </article>
        <article className="admin-card">
          <h3>Published Routes</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{pageCount}</p>
        </article>
        <article className="admin-card">
          <h3>Team Members</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{userCount}</p>
        </article>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <h3>Recent Leads</h3>
          <div className="admin-stack">
            {recentLeads.map((lead) => (
              <div key={lead.id}>
                <strong>{lead.name}</strong>
                <p className="admin-muted" style={{ marginBottom: 0 }}>
                  {lead.company || lead.email} • {lead.status.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <h3>Recently Updated Pages</h3>
          <div className="admin-stack">
            {recentPages.map((page) => (
              <div key={page.id}>
                <strong>{page.title}</strong>
                <p className="admin-muted" style={{ marginBottom: "8px" }}>
                  {page.slug}
                </p>
                <Link href={`/admin/content/${page.id}`}>Open editor</Link>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
