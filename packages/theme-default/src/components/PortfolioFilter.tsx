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
            className={
              isSelected
                ? "px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                : "px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            }
          >
            {tech}
          </button>
        );
      })}

      {shouldCollapse && !expanded && hiddenCount > 0 && (
        <button 
          type="button" 
          onClick={() => setExpanded(true)} 
          className="px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 transition-colors"
        >
          +{hiddenCount}
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
