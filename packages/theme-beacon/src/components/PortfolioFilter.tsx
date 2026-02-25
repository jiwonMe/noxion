"use client";

import { useState } from "react";
import type { PortfolioFilterProps } from "@noxion/renderer";

const MAX_VISIBLE = 8;

export function PortfolioFilter({ technologies, selectedTechnologies, onToggle }: PortfolioFilterProps) {
  const [expanded, setExpanded] = useState(false);

  if (technologies.length === 0) return null;

  const shouldCollapse = technologies.length > MAX_VISIBLE;
  const visible = shouldCollapse && !expanded ? technologies.slice(0, MAX_VISIBLE) : technologies;
  const hiddenCount = shouldCollapse ? technologies.length - MAX_VISIBLE : 0;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((tech) => {
        const isSelected = selectedTechnologies.includes(tech);
        return (
          <button
            key={tech}
            onClick={() => onToggle(tech)}
            type="button"
            className={isSelected
              ? "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 transition-colors"
              : "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100 transition-colors"
            }
          >
            {tech}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button type="button" onClick={() => setExpanded(true)} className="inline-flex items-center px-3 py-1 rounded-full text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          +{hiddenCount}
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
