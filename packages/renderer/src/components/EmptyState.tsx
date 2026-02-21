export interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Check back later for new content.",
}: EmptyStateProps) {
  return (
    <div
      className="noxion-empty-state"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1rem",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--noxion-foreground, #000)",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: "1rem",
          color: "var(--noxion-mutedForeground, #737373)",
        }}
      >
        {message}
      </p>
    </div>
  );
}
