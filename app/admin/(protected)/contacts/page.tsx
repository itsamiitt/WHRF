import { ContactStatus, Role } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  createContactAction,
  updateContactAction,
  deleteContactAction,
} from "@/app/admin/actions";

const statusOptions = Object.values(ContactStatus);

export default async function AdminContactsPage() {
  await requireRole([Role.ADMIN, Role.SALES]);

  const contacts = await prisma.contact.findMany({
    include: { createdBy: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Contacts</h1>
          <p>Manage your CRM contacts — prospects, customers, and corporate leads.</p>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: "var(--space-4)" }}>Add New Contact</h2>
        <form action={createContactAction} className="admin-grid-form">
          <div>
            <label>Full Name *</label>
            <input name="name" required placeholder="Rahul Sharma" />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" placeholder="rahul@example.com" />
          </div>
          <div>
            <label>Phone</label>
            <input name="phone" placeholder="+91 9XXXXXXXXX" />
          </div>
          <div>
            <label>Company</label>
            <input name="company" placeholder="Acme Pvt. Ltd." />
          </div>
          <div>
            <label>Designation</label>
            <input name="designation" placeholder="IT Manager" />
          </div>
          <div>
            <label>City</label>
            <input name="city" placeholder="Mumbai" />
          </div>
          <div>
            <label>Status</label>
            <select name="status" defaultValue="PROSPECT">
              {statusOptions.map(s => (
                <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <textarea name="notes" rows={2} placeholder="Any context about this contact..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button className="admin-button-primary" type="submit">Add Contact</button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: "var(--space-4)" }}>All Contacts ({contacts.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Company</th>
              <th>Phone</th>
              <th>City</th>
              <th>Status</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr><td colSpan={7} className="admin-muted" style={{ padding: "24px", textAlign: "center" }}>No contacts yet. Add your first contact above.</td></tr>
            )}
            {contacts.map(c => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                  {c.designation && <p className="admin-muted" style={{ marginBottom: 0 }}>{c.designation}</p>}
                  {c.email && <p className="admin-muted" style={{ marginBottom: 0 }}>{c.email}</p>}
                </td>
                <td>{c.company || <span className="admin-muted">—</span>}</td>
                <td>{c.phone || <span className="admin-muted">—</span>}</td>
                <td>{c.city || <span className="admin-muted">—</span>}</td>
                <td><span className="admin-pill">{c.status.toLowerCase()}</span></td>
                <td className="admin-muted">{c.createdAt.toLocaleDateString("en-IN")}</td>
                <td>
                  <details style={{ position: "relative" }}>
                    <summary className="admin-button-secondary" style={{ cursor: "pointer", display: "inline-block" }}>Edit</summary>
                    <div className="admin-card" style={{ position: "absolute", right: 0, zIndex: 10, minWidth: 280, marginTop: 8 }}>
                      <form action={updateContactAction} className="admin-stack">
                        <input type="hidden" name="id" value={c.id} />
                        <input name="name" defaultValue={c.name} placeholder="Full Name" required />
                        <input name="email" type="email" defaultValue={c.email ?? ""} placeholder="Email" />
                        <input name="phone" defaultValue={c.phone ?? ""} placeholder="Phone" />
                        <input name="company" defaultValue={c.company ?? ""} placeholder="Company" />
                        <input name="designation" defaultValue={c.designation ?? ""} placeholder="Designation" />
                        <input name="city" defaultValue={c.city ?? ""} placeholder="City" />
                        <select name="status" defaultValue={c.status}>
                          {statusOptions.map(s => (
                            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                          ))}
                        </select>
                        <textarea name="notes" rows={2} defaultValue={c.notes ?? ""} placeholder="Notes" />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="admin-button-primary" type="submit">Save</button>
                          <form action={deleteContactAction} style={{ display: "inline" }}>
                            <input type="hidden" name="id" value={c.id} />
                            <button className="admin-button-secondary" type="submit" style={{ color: "#e53e3e" }}>Delete</button>
                          </form>
                        </div>
                      </form>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
