import type { TagFilterProps } from "../theme/types";

export function TagFilter({ tags, selectedTags, onToggle }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div
      className="noxion-tag-filter"
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
    >
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            type="button"
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid var(--noxion-border, #e5e5e5)",
              backgroundColor: isSelected
                ? "var(--noxion-primary, #2563eb)"
                : "transparent",
              color: isSelected
                ? "var(--noxion-primaryForeground, #fff)"
                : "var(--noxion-foreground, #000)",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
