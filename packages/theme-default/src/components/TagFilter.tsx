"use client";

import { useState } from "react";
import type { TagFilterProps } from "@noxion/renderer";
import * as styles from "./TagFilter.css";

export function TagFilter({ tags, selectedTags, onToggle, maxVisible }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (tags.length === 0) return null;

  const shouldCollapse = maxVisible !== undefined && tags.length > maxVisible;
  const visibleTags = shouldCollapse && !expanded ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = shouldCollapse ? tags.length - maxVisible! : 0;

  return (
    <div className={styles.wrapper}>
      {visibleTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            type="button"
            className={isSelected ? `${styles.tag} ${styles.tagSelected}` : styles.tag}
          >
            {tag}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button type="button" onClick={() => setExpanded(true)} className={styles.tagMore}>
          +{hiddenCount} more
        </button>
      )}

      {shouldCollapse && expanded && (
        <button type="button" onClick={() => setExpanded(false)} className={styles.tagMore}>
          Show less
        </button>
      )}
    </div>
  );
}
