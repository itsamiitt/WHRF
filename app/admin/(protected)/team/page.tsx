import { Role } from "@prisma/client";

import { createUserAction } from "@/app/admin/actions";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const roles = Object.values(Role);

export default async function AdminTeamPage() {
  await requireRole([Role.ADMIN]);
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "asc"
    }
  });

  return (
    <section className="admin-section admin-stack">
      <div className="admin-header">
        <div>
          <h1>Team</h1>
          <p>Create admin, editor, and sales logins for the built-in CMS.</p>
        </div>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <h3>Create User</h3>
          <form action={createUserAction} className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" required type="text" />
            </div>
            <div className="admin-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" required type="email" />
            </div>
            <div className="admin-field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" required type="text" />
            </div>
            <div className="admin-field">
              <label htmlFor="role">Role</label>
              <select defaultValue={Role.EDITOR} id="role" name="role">
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-actions">
              <button className="admin-button" type="submit">
                Create User
              </button>
            </div>
          </form>
        </article>

        <article className="admin-card">
          <h3>Existing Team</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </div>
    </section>
  );
}
