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
            className={
              isSelected
                ? "px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                : "px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
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
          className="px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 transition-colors"
        >
          +{hiddenCount} more
        </button>
      )}

      {shouldCollapse && expanded && (
        <button 
          type="button" 
          onClick={() => setExpanded(false)} 
          className="px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 transition-colors"
        >
          Show less
        </button>
      )}
    </div>
  );
}
