import { LeadStatus, Role } from "@prisma/client";

import { updateLeadAction } from "@/app/admin/actions";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const leadStatuses = Object.values(LeadStatus);

export default async function AdminLeadsPage() {
  await requireRole([Role.ADMIN, Role.SALES]);

  const [leads, users] = await Promise.all([
    prisma.lead.findMany({
      include: {
        assignedTo: true,
        activities: {
          orderBy: {
            createdAt: "desc"
          },
          take: 3
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.user.findMany({
      orderBy: {
        name: "asc"
      }
    })
  ]);

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Leads</h1>
          <p>Website submissions now persist to PostgreSQL and can be assigned to the sales team.</p>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Service</th>
              <th>Status</th>
              <th>Assignment</th>
              <th>Latest Activity</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong>{lead.name}</strong>
                  <p className="admin-muted" style={{ marginBottom: 0 }}>
                    {lead.company || "No company"} • {lead.email}
                  </p>
                  <p className="admin-muted" style={{ marginBottom: 0 }}>
                    {lead.phone}
                  </p>
                </td>
                <td>{lead.service || "General enquiry"}</td>
                <td>
                  <span className="admin-pill">{lead.status.toLowerCase()}</span>
                </td>
                <td>{lead.assignedTo?.name || "Unassigned"}</td>
                <td>
                  {lead.activities[0] ? (
                    <>
                      <strong>{lead.activities[0].summary}</strong>
                      <p className="admin-muted" style={{ marginBottom: 0 }}>
                        {lead.activities[0].detail || "No note"}
                      </p>
                    </>
                  ) : (
                    <span className="admin-muted">No activity yet</span>
                  )}
                </td>
                <td>
                  <form action={updateLeadAction} className="admin-stack">
                    <input name="leadId" type="hidden" value={lead.id} />
                    <select defaultValue={lead.status} name="status">
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <select defaultValue={lead.assignedToId || ""} name="assignedToId">
                      <option value="">Unassigned</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="note"
                      placeholder="Add a note for the timeline"
                      rows={3}
                    />
                    <button className="admin-button-secondary" type="submit">
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
