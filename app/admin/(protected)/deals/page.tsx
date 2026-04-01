import { DealStage, DealPriority, Role } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  createDealAction,
  updateDealAction,
  deleteDealAction,
} from "@/app/admin/actions";

const stageOptions = Object.values(DealStage);
const priorityOptions = Object.values(DealPriority);

const SERVICES = [
  "CCTV Installation",
  "Computer & CPU Sales/Repair",
  "Server Installation",
  "Biometric Attendance",
  "Corporate IT AMC",
  "Networking Solutions",
  "Hardware Support",
];

const stageLabel = (s: DealStage) =>
  s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()).replace("Closed Won", "Won ✓").replace("Closed Lost", "Lost ✗");

function formatINR(val: number | null) {
  if (!val) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
}

export default async function AdminDealsPage() {
  await requireRole([Role.ADMIN, Role.SALES]);

  const [deals, contacts, users] = await Promise.all([
    prisma.deal.findMany({
      include: { contact: true, assignedTo: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contact.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPipelineValue = deals
    .filter(d => d.stage !== DealStage.CLOSED_LOST)
    .reduce((sum, d) => sum + (d.value ?? 0), 0);
  const wonValue = deals
    .filter(d => d.stage === DealStage.CLOSED_WON)
    .reduce((sum, d) => sum + (d.value ?? 0), 0);

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Deals</h1>
          <p>Track your sales pipeline from prospecting through to closed won.</p>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div className="admin-card" style={{ padding: "12px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{formatINR(totalPipelineValue)}</div>
            <p className="admin-muted" style={{ margin: 0 }}>Pipeline Value</p>
          </div>
          <div className="admin-card" style={{ padding: "12px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{formatINR(wonValue)}</div>
            <p className="admin-muted" style={{ margin: 0 }}>Won Value</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: "var(--space-4)" }}>Add New Deal</h2>
        <form action={createDealAction} className="admin-grid-form">
          <div>
            <label>Deal Title *</label>
            <input name="title" required placeholder="e.g. CCTV for Acme HQ" />
          </div>
          <div>
            <label>Contact</label>
            <select name="contactId">
              <option value="">— No Contact —</option>
              {contacts.map(c => (
                <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Deal Value (INR)</label>
            <input name="value" type="number" min="0" step="1000" placeholder="250000" />
          </div>
          <div>
            <label>Service</label>
            <select name="service">
              <option value="">— Select Service —</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Stage</label>
            <select name="stage" defaultValue="PROSPECTING">
              {stageOptions.map(s => (
                <option key={s} value={s}>{stageLabel(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Priority</label>
            <select name="priority" defaultValue="MEDIUM">
              {priorityOptions.map(p => (
                <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Expected Close Date</label>
            <input name="expectedClose" type="date" />
          </div>
          <div>
            <label>Assigned To</label>
            <select name="assignedToId">
              <option value="">— Unassigned —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Notes</label>
            <textarea name="notes" rows={2} placeholder="Deal background, requirements, key stakeholders..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button className="admin-button-primary" type="submit">Add Deal</button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: "var(--space-4)" }}>All Deals ({deals.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Value</th>
              <th>Stage</th>
              <th>Priority</th>
              <th>Assigned</th>
              <th>Expected Close</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.length === 0 && (
              <tr><td colSpan={9} className="admin-muted" style={{ padding: "24px", textAlign: "center" }}>No deals yet. Add your first deal above.</td></tr>
            )}
            {deals.map(d => (
              <tr key={d.id}>
                <td>
                  <strong>{d.title}</strong>
                  {d.notes && <p className="admin-muted" style={{ marginBottom: 0, maxWidth: 180 }}>{d.notes.slice(0, 60)}{d.notes.length > 60 ? "…" : ""}</p>}
                </td>
                <td>{d.contact?.name || <span className="admin-muted">—</span>}</td>
                <td>{d.service || <span className="admin-muted">—</span>}</td>
                <td>{formatINR(d.value)}</td>
                <td><span className="admin-pill">{stageLabel(d.stage)}</span></td>
                <td><span className="admin-pill">{d.priority.toLowerCase()}</span></td>
                <td>{d.assignedTo?.name || <span className="admin-muted">Unassigned</span>}</td>
                <td className="admin-muted">{d.expectedClose ? d.expectedClose.toLocaleDateString("en-IN") : "—"}</td>
                <td>
                  <details style={{ position: "relative" }}>
                    <summary className="admin-button-secondary" style={{ cursor: "pointer", display: "inline-block" }}>Edit</summary>
                    <div className="admin-card" style={{ position: "absolute", right: 0, zIndex: 10, minWidth: 300, marginTop: 8 }}>
                      <form action={updateDealAction} className="admin-stack">
                        <input type="hidden" name="id" value={d.id} />
                        <input name="title" defaultValue={d.title} required placeholder="Deal Title" />
                        <select name="contactId" defaultValue={d.contactId ?? ""}>
                          <option value="">— No Contact —</option>
                          {contacts.map(c => (
                            <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
                          ))}
                        </select>
                        <input name="value" type="number" defaultValue={d.value ?? ""} placeholder="Value (INR)" />
                        <select name="service" defaultValue={d.service ?? ""}>
                          <option value="">— Select Service —</option>
                          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select name="stage" defaultValue={d.stage}>
                          {stageOptions.map(s => (
                            <option key={s} value={s}>{stageLabel(s)}</option>
                          ))}
                        </select>
                        <select name="priority" defaultValue={d.priority}>
                          {priorityOptions.map(p => (
                            <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                          ))}
                        </select>
                        <input name="expectedClose" type="date" defaultValue={d.expectedClose ? d.expectedClose.toISOString().split("T")[0] : ""} />
                        <select name="assignedToId" defaultValue={d.assignedToId ?? ""}>
                          <option value="">— Unassigned —</option>
                          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <textarea name="notes" rows={2} defaultValue={d.notes ?? ""} placeholder="Notes" />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="admin-button-primary" type="submit">Save</button>
                          <form action={deleteDealAction} style={{ display: "inline" }}>
                            <input type="hidden" name="id" value={d.id} />
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
