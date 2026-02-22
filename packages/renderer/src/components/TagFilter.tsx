"use client";

import { useState } from "react";
import type { TagFilterProps } from "../theme/types";

export function TagFilter({ tags, selectedTags, onToggle, maxVisible, className }: TagFilterProps & { className?: string }) {
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) return null;

  const shouldCollapse = maxVisible !== undefined && tags.length > maxVisible;
  const visibleTags = shouldCollapse && !expanded ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = shouldCollapse ? tags.length - maxVisible! : 0;

  return (
    <div className={className ? `noxion-tag-filter ${className}` : "noxion-tag-filter"}>
      {visibleTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        const tagClass = isSelected
          ? "noxion-tag-filter__tag noxion-tag-filter__tag--selected"
          : "noxion-tag-filter__tag";
        return (
          <button key={tag} onClick={() => onToggle(tag)} type="button" className={tagClass}>
            {tag}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="noxion-tag-filter__tag noxion-tag-filter__tag--more"
        >
          +{hiddenCount}
        </button>
      )}

      {shouldCollapse && expanded && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="noxion-tag-filter__tag noxion-tag-filter__tag--more"
        >
          Show less
        </button>
      )}
    </div>
  );
}
