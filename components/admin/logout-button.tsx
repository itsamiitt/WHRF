"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      className="admin-button-secondary"
      onClick={() =>
        signOut({
          callbackUrl: "/admin/login"
        })
      }
      type="button"
    >
      Sign Out
    </button>
  );
}
