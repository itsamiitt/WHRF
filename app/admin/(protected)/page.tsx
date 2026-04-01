import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { DealStage, TaskStatus } from "@prisma/client";

export default async function AdminOverviewPage() {
  await requireUser();

  const [
    leadCount,
    openLeadCount,
    contactCount,
    dealCount,
    openDealCount,
    taskCount,
    pendingTaskCount,
    pageCount,
    userCount,
    recentLeads,
    recentContacts,
    recentDeals,
    pendingTasks,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: { in: ["NEW", "CONTACTED", "QUALIFIED"] } } }),
    prisma.contact.count(),
    prisma.deal.count(),
    prisma.deal.count({ where: { stage: { notIn: [DealStage.CLOSED_WON, DealStage.CLOSED_LOST] } } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } } }),
    prisma.page.count(),
    prisma.user.count(),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.deal.findMany({ include: { contact: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.task.findMany({
      where: { status: { in: [TaskStatus.TODO, TaskStatus.IN_PROGRESS] } },
      include: { assignedTo: true, deal: true },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
      take: 5,
    }),
  ]);

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Overview</h1>
          <p>Full-stack CRM dashboard — leads, contacts, deals, tasks, and content management.</p>
        </div>
        <div className="admin-actions">
          <Link className="admin-button-secondary" href="/" target="_blank">Open Site</Link>
          <Link className="admin-button" href="/admin/content">Manage Content</Link>
        </div>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <h3>Total Leads</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{leadCount}</p>
          <p className="admin-muted" style={{ margin: 0 }}>{openLeadCount} open</p>
        </article>
        <article className="admin-card">
          <h3>Contacts</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{contactCount}</p>
          <Link href="/admin/contacts" style={{ fontSize: "0.85rem" }}>Manage →</Link>
        </article>
        <article className="admin-card">
          <h3>Deals</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{dealCount}</p>
          <p className="admin-muted" style={{ margin: 0 }}>{openDealCount} active</p>
        </article>
        <article className="admin-card">
          <h3>Pending Tasks</h3>
          <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{pendingTaskCount}</p>
          <p className="admin-muted" style={{ margin: 0 }}>of {taskCount} total</p>
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
            {recentLeads.length === 0 && <p className="admin-muted">No leads yet.</p>}
            {recentLeads.map((lead) => (
              <div key={lead.id}>
                <strong>{lead.name}</strong>
                <p className="admin-muted" style={{ marginBottom: 0 }}>
                  {lead.company || lead.email} • {lead.status.toLowerCase()}
                </p>
              </div>
            ))}
            <Link href="/admin/leads" style={{ fontSize: "0.85rem" }}>View all leads →</Link>
          </div>
        </article>

        <article className="admin-card">
          <h3>Recent Contacts</h3>
          <div className="admin-stack">
            {recentContacts.length === 0 && <p className="admin-muted">No contacts yet.</p>}
            {recentContacts.map((c) => (
              <div key={c.id}>
                <strong>{c.name}</strong>
                <p className="admin-muted" style={{ marginBottom: 0 }}>
                  {c.company || "—"} • {c.status.toLowerCase()}
                </p>
              </div>
            ))}
            <Link href="/admin/contacts" style={{ fontSize: "0.85rem" }}>View all contacts →</Link>
          </div>
        </article>

        <article className="admin-card">
          <h3>Active Deals</h3>
          <div className="admin-stack">
            {recentDeals.length === 0 && <p className="admin-muted">No deals yet.</p>}
            {recentDeals.map((d) => (
              <div key={d.id}>
                <strong>{d.title}</strong>
                <p className="admin-muted" style={{ marginBottom: 0 }}>
                  {d.contact?.name || "No contact"} • {d.stage.toLowerCase().replace("_", " ")}
                </p>
              </div>
            ))}
            <Link href="/admin/deals" style={{ fontSize: "0.85rem" }}>View all deals →</Link>
          </div>
        </article>

        <article className="admin-card">
          <h3>Pending Tasks</h3>
          <div className="admin-stack">
            {pendingTasks.length === 0 && <p className="admin-muted">All tasks complete!</p>}
            {pendingTasks.map((t) => {
              const isOverdue = t.dueDate && t.dueDate < new Date();
              return (
                <div key={t.id}>
                  <strong style={{ color: isOverdue ? "#e53e3e" : undefined }}>{t.title}</strong>
                  <p className="admin-muted" style={{ marginBottom: 0 }}>
                    {t.assignedTo?.name || "Unassigned"}
                    {t.dueDate ? ` • Due ${t.dueDate.toLocaleDateString("en-IN")}` : ""}
                    {isOverdue ? " ⚠ overdue" : ""}
                  </p>
                </div>
              );
            })}
            <Link href="/admin/tasks" style={{ fontSize: "0.85rem" }}>View all tasks →</Link>
          </div>
        </article>
      </div>
    </section>
  );
}
