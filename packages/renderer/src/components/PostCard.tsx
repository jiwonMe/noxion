import type { PostCardProps } from "../theme/types";

export function PostCard({
  title,
  slug,
  date,
  tags,
  coverImage,
  category,
}: PostCardProps) {
  return (
    <a
      href={`/${slug}`}
      className="noxion-post-card"
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        borderRadius: "var(--noxion-border-radius, 0.5rem)",
        border: "1px solid var(--noxion-border, #e5e5e5)",
        overflow: "hidden",
        backgroundColor: "var(--noxion-card, #fff)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {coverImage ? (
        <div
          style={{
            width: "100%",
            height: "200px",
            backgroundImage: `url(${coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "200px",
            background: "linear-gradient(135deg, var(--noxion-primary, #2563eb), var(--noxion-accent, #f5f5f5))",
          }}
        />
      )}

      <div style={{ padding: "1rem" }}>
        {category && (
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--noxion-primary, #2563eb)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </span>
        )}

        <h3
          style={{
            margin: "0.25rem 0",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--noxion-cardForeground, #000)",
            lineHeight: 1.4,
          }}
        >
          {title}
        </h3>

        <time
          dateTime={date}
          style={{
            fontSize: "0.875rem",
            color: "var(--noxion-mutedForeground, #737373)",
          }}
        >
          {date}
        </time>

        {tags.length > 0 && (
          <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "9999px",
                  backgroundColor: "var(--noxion-muted, #f5f5f5)",
                  color: "var(--noxion-mutedForeground, #737373)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
