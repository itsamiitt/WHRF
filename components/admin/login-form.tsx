"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = useState("admin@wrhwfour.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin"
    });

    setIsSubmitting(false);

    if (result?.ok && result.url) {
      window.location.href = result.url;
      return;
    }

    setError("The email or password is incorrect.");
  }

  return (
    <form className="admin-stack" onSubmit={handleSubmit}>
      <div className="admin-field">
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>

      <div className="admin-field">
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <button className="admin-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
