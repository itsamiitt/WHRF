import { TaskStatus, TaskPriority, Role } from "@prisma/client";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/app/admin/actions";

const statusOptions = Object.values(TaskStatus);
const priorityOptions = Object.values(TaskPriority);

const statusLabel = (s: TaskStatus) =>
  s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase());

const priorityColor: Record<TaskPriority, string> = {
  LOW: "#68d391",
  MEDIUM: "#f6ad55",
  HIGH: "#fc8181",
  URGENT: "#e53e3e",
};

export default async function AdminTasksPage() {
  await requireRole([Role.ADMIN, Role.SALES, Role.EDITOR]);

  const [tasks, deals, users] = await Promise.all([
    prisma.task.findMany({
      include: { deal: true, assignedTo: true, createdBy: true },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    }),
    prisma.deal.findMany({ orderBy: { title: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  const todo = tasks.filter(t => t.status === TaskStatus.TODO);
  const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const done = tasks.filter(t => t.status === TaskStatus.DONE || t.status === TaskStatus.CANCELLED);

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Tasks</h1>
          <p>Track follow-ups, site visits, calls, and internal tasks linked to deals.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="admin-card" style={{ padding: "10px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{todo.length}</div>
            <p className="admin-muted" style={{ margin: 0 }}>To Do</p>
          </div>
          <div className="admin-card" style={{ padding: "10px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{inProgress.length}</div>
            <p className="admin-muted" style={{ margin: 0 }}>In Progress</p>
          </div>
          <div className="admin-card" style={{ padding: "10px 16px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{done.length}</div>
            <p className="admin-muted" style={{ margin: 0 }}>Done</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: "var(--space-4)" }}>Add New Task</h2>
        <form action={createTaskAction} className="admin-grid-form">
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Task Title *</label>
            <input name="title" required placeholder="e.g. Call Rahul for site visit confirmation" />
          </div>
          <div>
            <label>Status</label>
            <select name="status" defaultValue="TODO">
              {statusOptions.map(s => (
                <option key={s} value={s}>{statusLabel(s)}</option>
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
            <label>Due Date</label>
            <input name="dueDate" type="date" />
          </div>
          <div>
            <label>Linked Deal</label>
            <select name="dealId">
              <option value="">— No Deal —</option>
              {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
            </select>
          </div>
          <div>
            <label>Assigned To</label>
            <select name="assignedToId">
              <option value="">— Unassigned —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Description</label>
            <textarea name="description" rows={2} placeholder="Task details, context, or instructions..." />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button className="admin-button-primary" type="submit">Add Task</button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ marginBottom: "var(--space-4)" }}>All Tasks ({tasks.length})</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Deal</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assigned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr><td colSpan={7} className="admin-muted" style={{ padding: "24px", textAlign: "center" }}>No tasks yet. Add your first task above.</td></tr>
            )}
            {tasks.map(t => {
              const isOverdue = t.dueDate && t.dueDate < new Date() && t.status !== TaskStatus.DONE && t.status !== TaskStatus.CANCELLED;
              return (
                <tr key={t.id}>
                  <td>
                    <strong>{t.title}</strong>
                    {t.description && <p className="admin-muted" style={{ marginBottom: 0, maxWidth: 200 }}>{t.description.slice(0, 60)}{t.description.length > 60 ? "…" : ""}</p>}
                  </td>
                  <td>{t.deal?.title || <span className="admin-muted">—</span>}</td>
                  <td><span className="admin-pill">{statusLabel(t.status)}</span></td>
                  <td>
                    <span className="admin-pill" style={{ background: priorityColor[t.priority] + "33", color: priorityColor[t.priority] }}>
                      {t.priority.toLowerCase()}
                    </span>
                  </td>
                  <td style={{ color: isOverdue ? "#e53e3e" : undefined }}>
                    {t.dueDate ? t.dueDate.toLocaleDateString("en-IN") : <span className="admin-muted">—</span>}
                    {isOverdue && <span style={{ marginLeft: 4, fontSize: "0.7rem" }}>OVERDUE</span>}
                  </td>
                  <td>{t.assignedTo?.name || <span className="admin-muted">Unassigned</span>}</td>
                  <td>
                    <details style={{ position: "relative" }}>
                      <summary className="admin-button-secondary" style={{ cursor: "pointer", display: "inline-block" }}>Edit</summary>
                      <div className="admin-card" style={{ position: "absolute", right: 0, zIndex: 10, minWidth: 280, marginTop: 8 }}>
                        <form action={updateTaskAction} className="admin-stack">
                          <input type="hidden" name="id" value={t.id} />
                          <input name="title" defaultValue={t.title} required placeholder="Task Title" />
                          <select name="status" defaultValue={t.status}>
                            {statusOptions.map(s => (
                              <option key={s} value={s}>{statusLabel(s)}</option>
                            ))}
                          </select>
                          <select name="priority" defaultValue={t.priority}>
                            {priorityOptions.map(p => (
                              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                            ))}
                          </select>
                          <input name="dueDate" type="date" defaultValue={t.dueDate ? t.dueDate.toISOString().split("T")[0] : ""} />
                          <select name="dealId" defaultValue={t.dealId ?? ""}>
                            <option value="">— No Deal —</option>
                            {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                          </select>
                          <select name="assignedToId" defaultValue={t.assignedToId ?? ""}>
                            <option value="">— Unassigned —</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                          <textarea name="description" rows={2} defaultValue={t.description ?? ""} placeholder="Description" />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="admin-button-primary" type="submit">Save</button>
                            <form action={deleteTaskAction} style={{ display: "inline" }}>
                              <input type="hidden" name="id" value={t.id} />
                              <button className="admin-button-secondary" type="submit" style={{ color: "#e53e3e" }}>Delete</button>
                            </form>
                          </div>
                        </form>
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
