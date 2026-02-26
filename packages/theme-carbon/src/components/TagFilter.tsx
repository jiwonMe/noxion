"use client";

import { useState } from "react";
import type { TagFilterProps } from "@noxion/renderer";

export function TagFilter({ tags, selectedTags, onToggle, maxVisible }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) return null;

  const shouldCollapse = maxVisible !== undefined && tags.length > maxVisible;
  const visibleTags = shouldCollapse && !expanded ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = shouldCollapse ? tags.length - maxVisible : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            type="button"
            className={
              isSelected
                ? "inline-flex items-center border border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-1 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)]"
                : "inline-flex items-center border border-[var(--color-border)] px-3 py-1 text-sm font-medium text-[var(--color-muted-foreground)] transition-all duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
            }
          >
            {tag}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center px-3 py-1 text-sm text-[var(--color-primary)] transition-opacity duration-[110ms] hover:opacity-80"
        >
          +{hiddenCount} more
        </button>
      )}

      {shouldCollapse && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="inline-flex items-center px-3 py-1 text-sm text-[var(--color-primary)] transition-opacity duration-[110ms] hover:opacity-80"
        >
          Show less
        </button>
      )}
    </div>
  );
}
