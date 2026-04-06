import Link from "next/link";

export function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "32px",
        background: "#f8fafc",
        color: "#0f172a",
        textAlign: "center"
      }}
    >
      <div>
        <h1 style={{ marginBottom: "12px" }}>Page Not Found</h1>
        <p style={{ color: "#475569", marginBottom: "24px" }}>
          The requested WRHW page could not be found.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 18px",
            borderRadius: "999px",
            background: "#2563eb",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: 700
          }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
