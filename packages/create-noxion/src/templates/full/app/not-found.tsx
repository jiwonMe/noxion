import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: 700, color: "var(--noxion-mutedForeground, #737373)" }}>
        404
      </h1>
      <p style={{ fontSize: "1.125rem", color: "var(--noxion-mutedForeground, #737373)" }}>
        This page could not be found.
      </p>
      <Link
        href="/"
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1.5rem",
          borderRadius: "var(--noxion-border-radius, 0.5rem)",
          backgroundColor: "var(--noxion-primary, #2563eb)",
          color: "var(--noxion-primaryForeground, #fff)",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
