export default function Custom500Page() {
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
        <h1 style={{ marginBottom: "12px" }}>Something Went Wrong</h1>
        <p style={{ color: "#475569", marginBottom: "24px" }}>
          An unexpected error occurred while loading this page.
        </p>
      </div>
    </main>
  );
}

export async function getStaticProps() {
  return {
    props: {}
  };
}
