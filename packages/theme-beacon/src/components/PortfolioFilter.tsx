"use client";

import { useState } from "react";
import type { PortfolioFilterProps } from "@noxion/renderer";
import * as styles from "./PortfolioFilter.css";

const MAX_VISIBLE = 8;

export function PortfolioFilter({ technologies, selectedTechnologies, onToggle }: PortfolioFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (technologies.length === 0) return null;

  const shouldCollapse = technologies.length > MAX_VISIBLE;
  const visible = shouldCollapse && !expanded ? technologies.slice(0, MAX_VISIBLE) : technologies;
  const hiddenCount = shouldCollapse ? technologies.length - MAX_VISIBLE : 0;

  return (
    <div className={styles.wrapper}>
      {visible.map((tech) => {
        const isSelected = selectedTechnologies.includes(tech);
        return (
          <button
            key={tech}
            onClick={() => onToggle(tech)}
            type="button"
            className={isSelected ? `${styles.tag} ${styles.tagSelected}` : styles.tag}
          >
            {tech}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button type="button" onClick={() => setExpanded(true)} className={styles.tag}>
          +{hiddenCount}
        </button>
      )}

      {shouldCollapse && expanded && (
        <button type="button" onClick={() => setExpanded(false)} className={styles.tag}>
          Show less
        </button>
      )}
    </div>
  );
}
