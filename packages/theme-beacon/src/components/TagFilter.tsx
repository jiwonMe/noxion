"use client";

import { useState } from "react";
import type { TagFilterProps } from "@noxion/renderer";

export function TagFilter({ tags, selectedTags, onToggle, maxVisible }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) return null;

  const shouldCollapse = maxVisible !== undefined && tags.length > maxVisible;
  const visibleTags = shouldCollapse && !expanded ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = shouldCollapse ? tags.length - maxVisible! : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            type="button"
            className={isSelected
              ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
              : "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100 transition-colors"
            }
          >
            {tag}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button type="button" onClick={() => setExpanded(true)} className="inline-flex items-center px-3 py-1 rounded-full text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          +{hiddenCount} more
        </button>
      )}

      {shouldCollapse && expanded && (
        <button type="button" onClick={() => setExpanded(false)} className="inline-flex items-center px-3 py-1 rounded-full text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          Show less
        </button>
      )}
    </div>
  );
}
